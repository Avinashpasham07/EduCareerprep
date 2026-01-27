import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    PlayIcon,
    ArrowPathIcon,
    CommandLineIcon,
    ListBulletIcon,
    CheckCircleIcon,
    XCircleIcon,
    LightBulbIcon,
    ChevronDownIcon,
    CpuChipIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import CHALLENGES from '../data/challenges';
import { userApi } from '../services/api';
import { updateUser } from '../store/slices/authSlice';
import Leaderboard from '../components/gamification/Leaderboard';
import GamificationCard from '../components/gamification/GamificationCard';

const LANGUAGES = [
    { id: 'javascript', name: 'JavaScript', exts: 'js' },
    { id: 'python', name: 'Python', exts: 'py' },
    { id: 'java', name: 'Java', exts: 'java' },
    { id: 'cpp', name: 'C++', exts: 'cpp' },
    { id: 'c', name: 'C', exts: 'c' }
];

const generateDriverCode = (language, code, problem) => {
    // Helper to format values for different languages
    const fmt = (val) => {
        if (language === 'python') return JSON.stringify(val).replace(/true/g, 'True').replace(/false/g, 'False');
        if (language === 'java') {
            if (Array.isArray(val)) return `new int[]{${val.join(',')}}`; // Naive int array
            if (typeof val === 'string') return `"${val}"`;
            return val;
        }
        if (language === 'cpp') {
            if (Array.isArray(val)) return `{${val.join(',')}}`;
            if (typeof val === 'string') return `"${val}"`;
            return val;
        }
        if (language === 'c') {
            // C is hard, skipping strict args generation for now or hardcoding for Two Sum
            return val;
        }
        return JSON.stringify(val);
    };

    if (language === 'python') {
        const tests = problem.testCases.map((t, i) =>
            `print(f"TEST:${i}:{two_sum(${fmt(t.args[0])}, ${fmt(t.args[1])}) == ${fmt(t.expected)}}:{two_sum(${fmt(t.args[0])}, ${fmt(t.args[1])})}")`
        ).join('\n');

        // Handling Different function signatures based on problem
        // For simplicity, hardcoding for now based on known problems or using *args
        // Actually, let's just make a generic runner script
        return `${code}\n\n# Test Driver\ntry:\n${problem.testCases.map((t, i) => {
            const args = t.args.map(a => fmt(a)).join(', ');
            return `    res = ${problem.fnName.python}(${args})\n    passed = res == ${fmt(t.expected)}\n    print(f"TEST_RESULT:${i}:{passed}:{res}:{${fmt(t.expected)}}")`;
        }).join('\n')}\nexcept Exception as e:\n    print(f"RUNTIME_ERROR:{e}")`;
    }

    if (language === 'java') {
        const tests = problem.testCases.map((t, i) => {
            const args = t.args.map(a => fmt(a)).join(', ');
            // For Two Sum specifically (returning int[])
            if (problem.id === 'two-sum') {
                return `
                 int[] res${i} = sol.twoSum(${args});
                 boolean passed${i} = java.util.Arrays.equals(res${i}, ${fmt(t.expected)});
                 System.out.println("TEST_RESULT:${i}:" + passed${i} + ":" + java.util.Arrays.toString(res${i}) + ":" + java.util.Arrays.toString(${fmt(t.expected)}));`;
            }
            // For Palindrome (boolean)
            return `
                 boolean res${i} = sol.isPalindrome(${args});
                 boolean passed${i} = res${i} == ${fmt(t.expected)};
                 System.out.println("TEST_RESULT:${i}:" + passed${i} + ":" + res${i} + ":" + ${fmt(t.expected)});`;
        }).join('\n');

        return `import java.util.*;\n${code}\n\npublic class Main {\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        ${tests}\n    }\n}`;
    }

    // C++ and C omitted for brevity in this iteration, fallback to simulated check or just running it
    return code;
};



export default function CodePlayground() {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [selectedProblem, setSelectedProblem] = useState(CHALLENGES[0]);
    const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
    const [code, setCode] = useState(CHALLENGES[0].starterCode[LANGUAGES[0].id]);
    const [output, setOutput] = useState([]);
    const [testResults, setTestResults] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'solved', 'unsolved'
    const [activeDifficulty, setActiveDifficulty] = useState('All');
    const [activeTopic, setActiveTopic] = useState('All');
    const [showHint, setShowHint] = useState(false);
    const [activeTab, setActiveTab] = useState('problems'); // 'problems' or 'leaderboard'

    // Update code when problem or language changes
    useEffect(() => {
        setCode(selectedProblem.starterCode[selectedLanguage.id] || '// Template not available');
        setOutput([]);
        setTestResults(null);
        setShowHint(false);
    }, [selectedProblem, selectedLanguage]);

    const handleChallengeSolved = async () => {
        if (!user || isSaving) return;
        if (user.solvedChallenges?.includes(selectedProblem.id)) {
            return;
        }

        setIsSaving(true);
        try {
            const res = await userApi.markChallengeSolved(selectedProblem.id);
            if (res.data.success) {
                const updatedUser = {
                    ...user,
                    solvedChallenges: res.data.solvedChallenges
                };
                dispatch(updateUser(updatedUser));
            }
        } catch (err) {
            console.error("Failed to mark challenge as solved:", err);
        } finally {
            setIsSaving(false);
        }
    };

    const setRandomProblem = () => {
        const problems = CHALLENGES.filter(c => {
            if (c.id === 'playground') return false;
            if (activeDifficulty !== 'All' && c.difficulty !== activeDifficulty) return false;
            if (activeTopic !== 'All' && !c.tags?.includes(activeTopic)) return false;
            return true;
        });
        if (problems.length === 0) return;
        const randomIndex = Math.floor(Math.random() * problems.length);
        setSelectedProblem(problems[randomIndex]);
    };

    const allTopics = Array.from(new Set(CHALLENGES.flatMap(c => c.tags || []))).sort();

    const filteredChallenges = CHALLENGES.filter(challenge => {
        // Status filter
        if (activeFilter === 'solved' && !user?.solvedChallenges?.includes(challenge.id)) return false;
        if (activeFilter === 'unsolved' && (challenge.id === 'playground' || user?.solvedChallenges?.includes(challenge.id))) return false;

        // Difficulty filter
        if (activeDifficulty !== 'All' && challenge.difficulty !== activeDifficulty) return false;

        // Topic filter
        if (activeTopic !== 'All' && !challenge.tags?.includes(activeTopic)) return false;

        return true;
    });

    const runCode = () => {
        setOutput([]);
        setTestResults(null);

        // REAL EXECUTION VIA PISTON API (For non-JS)
        if (selectedLanguage.id !== 'javascript') {
            setOutput([`Compiling ${selectedLanguage.name} code...`]);

            const PISTON_MAP = {
                'python': { language: 'python', version: '3.10.0' },
                'java': { language: 'java', version: '15.0.2' },
                'cpp': { language: 'c++', version: '10.2.0' },
                'c': { language: 'c', version: '10.2.0' }
            };

            const runtime = PISTON_MAP[selectedLanguage.id];

            // If it's a playground run (no test cases)
            if (selectedProblem.type === 'playground') {
                fetch('https://emkc.org/api/v2/piston/execute', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        language: runtime.language,
                        version: runtime.version,
                        files: [{ content: code }]
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.run) {
                            const lines = data.run.output ? data.run.output.split('\n') : [];
                            setOutput(lines);
                            if (data.run.stderr) {
                                setOutput(prev => [...prev, `Error: ${data.run.stderr}`]);
                            }
                        } else {
                            setOutput(["Execution failed (No response from compiler)."]);
                        }
                    })
                    .catch(err => {
                        setOutput([`API Error: ${err.message}`]);
                    });
            } else {
                // CHALLENGE MODE FOR COMPILED LANGUAGES
                // Inject Driver Logic for Python/Java
                let finalCode = code;
                if (selectedLanguage.id === 'python' || selectedLanguage.id === 'java') {
                    finalCode = generateDriverCode(selectedLanguage.id, code, selectedProblem);
                }

                fetch('https://emkc.org/api/v2/piston/execute', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        language: runtime.language,
                        version: runtime.version,
                        files: [{ content: finalCode }]
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.run) {
                            const rawOutput = data.run.output || "";
                            const lines = rawOutput.split('\n');

                            // Parse Test Results for Python/Java
                            if (selectedLanguage.id === 'python' || selectedLanguage.id === 'java') {
                                const results = [];
                                const logLines = [];

                                lines.forEach(line => {
                                    if (line.startsWith('TEST_RESULT:')) {
                                        const parts = line.split(':');
                                        // Format: TEST_RESULT:index:passed:actual:expected
                                        if (parts.length >= 5) {
                                            const index = parseInt(parts[1]);
                                            const passed = parts[2] === 'true' || parts[2] === 'True';
                                            const actual = parts[3];
                                            const expected = parts[4];

                                            if (selectedProblem.testCases[index]) {
                                                results.push({
                                                    input: selectedProblem.testCases[index].input,
                                                    expected: expected,
                                                    actual: actual,
                                                    passed: passed
                                                });
                                            }
                                        }
                                    } else if (line.startsWith('RUNTIME_ERROR:')) {
                                        logLines.push(line);
                                    } else {
                                        if (line.trim() !== "") logLines.push(line);
                                    }
                                });

                                if (data.run.stderr) logLines.push(`Stderr: ${data.run.stderr}`);

                                setOutput(logLines);
                                setTestResults(results.length > 0 ? results : null);

                                // If all tests passed, mark as solved
                                if (results.length > 0 && results.every(r => r.passed)) {
                                    handleChallengeSolved();
                                }

                                // Fallback if parsing failed but execution happened
                                if (results.length === 0 && data.run.code !== 0) {
                                    setOutput(prev => [...prev, "Compilation/Runtime Error: Check your code syntax."]);
                                }
                            } else {
                                // Default behavior for C/CPP (No driver yet)
                                setOutput(lines);
                                if (data.run.stderr) {
                                    setOutput(prev => [...prev, `Error: ${data.run.stderr}`]);
                                }
                            }
                        } else {
                            setOutput(["Execution failed (No response from compiler)."]);
                        }
                    })
                    .catch(err => {
                        setOutput([`API Error: ${err.message}`]);
                    });
            }
            return;
        }

        // REAL EXECUTION FOR JS
        const originalLog = console.log;
        const logs = [];

        // Override console.log
        console.log = (...args) => {
            logs.push(args.map(arg =>
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '));
        };

        try {
            if (selectedProblem.type === 'playground') {
                // eslint-disable-next-line no-eval
                eval(code);
                setOutput(logs);
            } else {
                // For challenges, verify against test cases (Only works for JS currently)
                if (selectedProblem.testCases && selectedProblem.testCases.length > 0) {
                    const userFunc = new Function(`
                        ${code}
                        return ${selectedProblem.starterCode.javascript.split(' ')[1].split('(')[0]};
                    `)();

                    const results = selectedProblem.testCases.map((test, index) => {
                        let result;
                        try {
                            const args = test.args;
                            if (Array.isArray(args)) {
                                result = userFunc(...args);
                            } else {
                                result = userFunc(args);
                            }
                            // Normalise sorting for array comparisons if needed (e.g. for Two Sum order doesn't matter?) 
                            // actually LeetCode usually specifies return in any order, but let's assume strict for now
                            // or better, handle specific problems if needed. For now, strict strict equality.

                            const stringResult = JSON.stringify(result);
                            // expected is already an object/value in challenges.js, DO NOT EVAL IT
                            const stringExpected = JSON.stringify(test.expected);
                            const passed = stringResult === stringExpected;

                            return {
                                input: test.input,
                                expected: JSON.stringify(test.expected),
                                actual: stringResult,
                                passed
                            };
                        } catch (e) {
                            return { passed: false, error: e.message };
                        }
                    });

                    setTestResults(results);
                    setOutput(["Tests executed. Check results below."]);

                    // If all tests passed, mark as solved
                    const allPassed = results.length > 0 && results.every(r => r.passed);
                    if (allPassed) {
                        handleChallengeSolved();
                    }
                } else {
                    setOutput(["No test cases defined for this problem in JS mode."]);
                }
            }
        } catch (error) {
            setOutput([...logs, `Error: ${error.message}`]);
        } finally {
            console.log = originalLog;
        }
    };

    return (
        <div className="min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 pt-24 pb-0 flex flex-col">
            <div className="max-w-[1600px] w-full mx-auto px-6 flex-1 flex flex-col min-h-0 pb-6">

                {/* Header */}
                <div className="mb-6 flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <CommandLineIcon className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-black dark:text-white font-display">
                                Code Arena <span className="text-xs font-normal text-slate-500 ml-2 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded">Beta</span>
                            </h1>
                            {user?.solvedChallenges?.length > 0 && (
                                <div className="ml-0 mt-2 flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full border border-green-100 dark:border-green-800/50 text-xs font-bold w-fit">
                                    <CheckCircleIcon className="w-3.5 h-3.5" />
                                    {user.solvedChallenges.length} Solved Achievements
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative group">
                            <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold transition-all min-w-[140px] justify-between">
                                <span className={selectedLanguage.id === 'javascript' ? 'text-yellow-600' : 'text-blue-500'}>{selectedLanguage.name}</span>
                                <ChevronDownIcon className="w-4 h-4" />
                            </button>
                            <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50">
                                {LANGUAGES.map(lang => (
                                    <button
                                        key={lang.id}
                                        onClick={() => setSelectedLanguage(lang)}
                                        className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between"
                                    >
                                        {lang.name}
                                        {selectedLanguage.id === lang.id && <CheckCircleIcon className="w-4 h-4 text-green-500" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => setCode(selectedProblem.starterCode[selectedLanguage.id])}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <ArrowPathIcon className="w-4 h-4" /> Reset
                        </button>
                        <button
                            onClick={runCode}
                            className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-lg shadow-green-500/30 transition-all active:scale-95"
                        >
                            <PlayIcon className="w-4 h-4" /> Run
                        </button>
                    </div>
                </div>

                {/* Sub-Navigation Bar */}
                <div className="mb-6 flex items-center justify-between glass-panel dark:bg-slate-900/50 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto whitespace-nowrap">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Arena Controls</span>
                        </div>
                        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setActiveFilter('all')}
                                className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${activeFilter === 'all' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-primary-100 dark:border-primary-800/50' : 'text-slate-500 border-transparent hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                All Tracks
                            </button>
                            <button
                                onClick={() => setActiveFilter('solved')}
                                className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${activeFilter === 'solved' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800/50' : 'text-slate-500 border-transparent hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                Solved
                            </button>
                            <button
                                onClick={() => setActiveFilter('unsolved')}
                                className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${activeFilter === 'unsolved' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800/50' : 'text-slate-500 border-transparent hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                Unsolved
                            </button>
                        </div>
                        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Difficulty</span>
                            <select
                                value={activeDifficulty}
                                onChange={(e) => setActiveDifficulty(e.target.value)}
                                className="bg-transparent text-xs font-bold text-slate-600 dark:text-slate-400 border-none focus:ring-0 cursor-pointer outline-none"
                            >
                                <option value="All">All</option>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Topic</span>
                            <select
                                value={activeTopic}
                                onChange={(e) => setActiveTopic(e.target.value)}
                                className="bg-transparent text-xs font-bold text-slate-600 dark:text-slate-400 border-none focus:ring-0 cursor-pointer outline-none max-w-[120px]"
                            >
                                <option value="All">All Topics</option>
                                {allTopics.map(topic => (
                                    <option key={topic} value={topic}>{topic}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">

                        <button
                            onClick={setRandomProblem}
                            className="flex items-center gap-1.5 px-6 py-2 bg-gradient-to-r from-emerald-600 to-primary-600 hover:from-emerald-700 hover:to-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 transition-all active:scale-95 group border border-emerald-500/20 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
                        >
                            <SparklesIcon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                            Generate Random Question
                        </button>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">

                    {/* Left Sidebar: Challenges & Leaderboard */}
                    <div className="col-span-12 md:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex gap-2">
                            <button
                                onClick={() => setActiveTab('problems')}
                                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${activeTab === 'problems' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                Problems
                            </button>
                            <button
                                onClick={() => setActiveTab('leaderboard')}
                                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${activeTab === 'leaderboard' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                Leaderboard
                            </button>
                        </div>

                        {activeTab === 'problems' ? (
                            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                {filteredChallenges.map(challenge => (
                                    <button
                                        key={challenge.id}
                                        onClick={() => setSelectedProblem(challenge)}
                                        className={`w-full text-left p-3 rounded-xl transition-all ${selectedProblem.id === challenge.id ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className={`font-semibold text-sm ${selectedProblem.id === challenge.id ? 'text-primary-700 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                                    {challenge.title}
                                                </span>
                                                {user?.solvedChallenges?.includes(challenge.id) && (
                                                    <CheckCircleIcon className="w-3.5 h-3.5 text-green-500" />
                                                )}
                                                {challenge.id === 'playground' && (
                                                    <SparklesIcon className="w-3.5 h-3.5 text-amber-500" />
                                                )}
                                            </div>
                                            {challenge.difficulty && (
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {challenge.difficulty}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 line-clamp-2">{challenge.description}</p>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto p-3 space-y-4">
                                <GamificationCard user={user} />
                                <div className="border-t border-slate-100 dark:border-white/5 pt-4">
                                    <Leaderboard />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Middle: Editor */}
                    <div className="col-span-12 md:col-span-5 flex flex-col bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-4 py-3 bg-slate-800 flex justify-between items-center border-b border-slate-700">
                            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
                                <CpuChipIcon className="w-4 h-4" /> {selectedLanguage.name} Source File
                            </span>
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                            </div>
                        </div>
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="flex-1 w-full p-4 font-mono text-sm leading-relaxed resize-none bg-slate-900 text-slate-300 focus:outline-none focus:ring-0 placeholder-slate-600"
                            spellCheck="false"
                            placeholder="// Start coding here..."
                        />
                        <div className="px-4 py-2 bg-slate-800 border-t border-slate-700 text-right">
                            <span className="text-xs text-slate-500">Ln {code.split('\n').length}, Col {code.length}</span>
                        </div>
                    </div>

                    {/* Right: Output & Test Cases */}
                    <div className="col-span-12 md:col-span-4 flex flex-col gap-6 h-full min-h-0">
                        {/* Description */}
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                <LightBulbIcon className="w-4 h-4 text-amber-500" /> Problem Description
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-2">
                                {selectedProblem.description}
                            </p>
                            {selectedProblem.hints && selectedProblem.hints.length > 0 && (
                                <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                                    <button
                                        onClick={() => setShowHint(!showHint)}
                                        className="flex items-center gap-2 text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors"
                                    >
                                        <LightBulbIcon className="w-4 h-4" />
                                        {showHint ? 'Hide Hint' : 'Need a Hint?'}
                                    </button>
                                    {showHint && (
                                        <div className="mt-2 space-y-2 animate-fade-in">
                                            {selectedProblem.hints.map((hint, i) => (
                                                <p key={i} className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800/50 italic">
                                                    💡 {hint}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Console */}
                        <div className="flex-1 bg-black rounded-2xl border border-slate-800 shadow-sm overflow-hidden flex flex-col min-h-0">
                            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
                                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Output / Test Results</span>
                            </div>
                            <div className="flex-1 p-4 overflow-auto font-mono text-sm space-y-4">
                                {testResults ? (
                                    <div className="space-y-3">
                                        {testResults.map((res, i) => (
                                            <div key={i} className={`p-3 rounded-lg border ${res.passed ? 'bg-green-900/10 border-green-900/30' : 'bg-red-900/10 border-red-900/30'}`}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    {res.passed ? <CheckCircleIcon className="w-4 h-4 text-green-500" /> : <XCircleIcon className="w-4 h-4 text-red-500" />}
                                                    <span className={`font-bold ${res.passed ? 'text-green-500' : 'text-red-500'}`}>
                                                        {res.passed ? 'Passed' : 'Failed'}
                                                    </span>
                                                </div>
                                                <div className="text-xs space-y-1 text-slate-400">
                                                    <div><span className="text-slate-500">Input:</span> <span className="text-slate-300">{res.input}</span></div>
                                                    <div><span className="text-slate-500">Expected:</span> <span className="text-green-400/80">{res.expected}</span></div>
                                                    <div><span className="text-slate-500">Actual:</span> <span className={res.passed ? "text-green-400/80" : "text-red-400/80"}>{res.actual}</span></div>
                                                    {res.error && <div className="text-red-400 mt-1">Error: {res.error}</div>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    output.map((line, i) => (
                                        <div key={i} className={`mb-1 break-words ${line.startsWith('Error') || line.startsWith('Failed') ? 'text-red-400' : 'text-green-400'}`}>
                                            <span className="text-slate-600 mr-2">$</span>{line}
                                        </div>
                                    ))
                                )}
                                {!testResults && output.length === 0 && (
                                    <div className="text-slate-600 italic">// Run code to see results...</div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    );
}
