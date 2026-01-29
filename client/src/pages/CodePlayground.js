import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    PlayIcon,
    ArrowPathIcon,
    CommandLineIcon,
    CheckCircleIcon,
    XCircleIcon,
    LightBulbIcon,
    ChevronDownIcon,
    CpuChipIcon,
    SparklesIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import CHALLENGES from '../data/challenges';
import { userApi } from '../services/api';
import { updateUser } from '../store/slices/authSlice';

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
    const [searchQuery, setSearchQuery] = useState('');
    const [activeMobileTab, setActiveMobileTab] = useState('problem'); // 'library', 'problem', 'code', 'output'
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);

    // Update code when problem or language changes
    useEffect(() => {
        setCode(selectedProblem.starterCode[selectedLanguage.id] || '// Template not available');
        setOutput([]);
        setTestResults(null);
    }, [selectedProblem, selectedLanguage]);

    const selectRandomProblem = () => {
        const problemsOnly = CHALLENGES.filter(c => c.id !== 'playground');
        const randomIndex = Math.floor(Math.random() * problemsOnly.length);
        const randomProblem = problemsOnly[randomIndex];
        setSelectedProblem(randomProblem);
        if (window.innerWidth < 1280) {
            setActiveMobileTab('problem');
        }
    };

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


    const filteredChallenges = CHALLENGES.filter(challenge => {
        // Status filter
        if (activeFilter === 'solved' && !user?.solvedChallenges?.includes(challenge.id)) return false;
        if (activeFilter === 'unsolved' && (challenge.id === 'playground' || user?.solvedChallenges?.includes(challenge.id))) return false;

        // Difficulty filter
        if (activeDifficulty !== 'All' && challenge.difficulty !== activeDifficulty) return false;

        // Topic filter
        if (activeTopic !== 'All' && !challenge.tags?.includes(activeTopic)) return false;

        // Search filter
        if (searchQuery && !challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !challenge.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;

        return true;
    });

    const scrollToResults = () => {
        if (window.innerWidth < 1280) {
            setActiveMobileTab('output');
        } else {
            setTimeout(() => {
                const el = document.getElementById('output-section');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };

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
                        scrollToResults();
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
                        scrollToResults();
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
                scrollToResults();
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
                    scrollToResults();

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
        <div className="min-h-screen xl:h-screen xl:overflow-hidden bg-slate-50 dark:bg-[#0a0c10] pt-20 md:pt-24 pb-0 flex flex-col">
            <div className="flex-1 flex flex-col min-h-0 px-2 md:px-6 pb-24 xl:pb-4">

                {/* Compact Desktop Header - Only for Title/Breadcrumbs */}
                <div className="hidden xl:flex mb-2 items-center justify-between bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm p-2 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                    <div className="flex items-center gap-3 px-2">
                        <CommandLineIcon className="w-4 h-4 text-primary-600" />
                        <h1 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Arena <span className="text-primary-600">Pro</span> <span className="mx-2 text-slate-400 opacity-30">/</span> <span className="text-slate-500">{selectedProblem.title}</span></h1>
                    </div>
                    <div className="flex items-center gap-2 px-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter opacity-50">Code Arena</span>
                    </div>
                </div>

                {/* Mobile Navigation Command Center */}
                <div className="xl:hidden flex flex-col gap-2 mb-4">
                    {/* Primary Action Row - Run & Random Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={runCode}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all"
                        >
                            <PlayIcon className="w-4 h-4" /> Execute
                        </button>
                        <button
                            onClick={selectRandomProblem}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-black text-xs uppercase tracking-[0.2em] active:scale-[0.98] transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
                        >
                            <ArrowPathIcon className="w-4 h-4" /> Random
                        </button>
                    </div>

                    {/* Navigation Row - Slim Tabs */}
                    <div className="flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-1 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setActiveMobileTab('library')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${activeMobileTab === 'library' ? 'bg-primary-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            <SparklesIcon className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-tight">Library</span>
                        </button>
                        {selectedProblem.id !== 'playground' && (
                            <button
                                onClick={() => setActiveMobileTab('problem')}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${activeMobileTab === 'problem' ? 'bg-primary-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            >
                                <LightBulbIcon className="w-3.5 h-3.5" />
                                <span className="text-[9px] font-black uppercase tracking-tight">Problem</span>
                            </button>
                        )}
                        <button
                            onClick={() => setActiveMobileTab('code')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${activeMobileTab === 'code' ? 'bg-primary-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            <CommandLineIcon className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-tight">Code</span>
                        </button>
                        <button
                            onClick={() => setActiveMobileTab('output')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${activeMobileTab === 'output' ? 'bg-primary-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            <CpuChipIcon className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-tight">Output</span>
                        </button>
                    </div>
                </div>

                {/* The Power-Grid: 3-Panel Professional Workspace */}
                <div className="flex-1 flex flex-col xl:grid xl:grid-cols-12 gap-4 min-h-0 overflow-visible">

                    {/* Panel 1: Integrated Problem Library (2 cols) */}
                    <div className={`${activeMobileTab === 'library' ? 'flex' : 'hidden'} xl:flex xl:col-span-2 flex-col bg-white dark:bg-slate-900/40 rounded-[1rem] xl:rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all hover:bg-white dark:hover:bg-slate-900/60 h-full`}>
                        <div className="p-3 md:p-5 border-b border-slate-200 dark:border-slate-800 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Educareerprep Code Arena</span>

                            </div>
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-xl py-2 pl-10 pr-4 text-[10px] font-bold focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-slate-400"
                                />
                            </div>

                            {/* Advanced Filters Row */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                                    {['all', 'solved', 'unsolved'].map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setActiveFilter(f)}
                                            className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${activeFilter === f ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <select
                                            value={activeDifficulty}
                                            onChange={(e) => setActiveDifficulty(e.target.value)}
                                            className="w-full bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-xl py-2 pl-3 pr-8 text-[9px] font-black uppercase tracking-tight focus:ring-1 focus:ring-primary-500 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="All">Difficulty</option>
                                            <option value="Easy">Easy</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Hard">Hard</option>
                                        </select>
                                        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={activeTopic}
                                            onChange={(e) => setActiveTopic(e.target.value)}
                                            className="w-full bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-xl py-2 pl-3 pr-8 text-[9px] font-black uppercase tracking-tight focus:ring-1 focus:ring-primary-500 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="All">Topic</option>
                                            {Array.from(new Set(CHALLENGES.flatMap(c => c.tags || []))).sort().map(tag => (
                                                <option key={tag} value={tag}>{tag}</option>
                                            ))}
                                        </select>
                                        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="max-h-[400px] xl:max-h-none flex-1 overflow-y-auto p-2.5 space-y-1.5 custom-scrollbar">
                            {filteredChallenges.length > 0 ? filteredChallenges.map(challenge => (
                                <button
                                    key={challenge.id}
                                    onClick={() => {
                                        setSelectedProblem(challenge);
                                        if (window.innerWidth < 1280) {
                                            setActiveMobileTab(challenge.id === 'playground' ? 'code' : 'problem');
                                        }
                                    }}
                                    className={`w-full text-left p-3 md:p-4 rounded-2xl transition-all group border ${selectedProblem.id === challenge.id ? 'bg-primary-500/10 border-primary-500/30 shadow-md ring-1 ring-primary-500/10' : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 border-transparent'}`}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <span className={`text-[10px] md:text-[11px] font-black truncate leading-none ${selectedProblem.id === challenge.id ? 'text-primary-600' : 'text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                                            {challenge.title}
                                        </span>
                                        {user?.solvedChallenges?.includes(challenge.id) && <CheckCircleIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500 shrink-0" />}
                                    </div>
                                    <div className="mt-1.5 md:mt-2 flex gap-2">
                                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-lg ${challenge.difficulty === 'Easy' ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'}`}>
                                            {challenge.difficulty}
                                        </span>
                                    </div>
                                </button>
                            )) : (
                                <div className="p-8 flex flex-col items-center justify-center text-center space-y-3 opacity-40">
                                    <MagnifyingGlassIcon className="w-8 h-8 text-slate-500" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">No_Matches_Found</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Panel 2: Challenge Briefing (5 cols) */}
                    <div className={`${activeMobileTab === 'problem' ? 'flex' : 'hidden'} xl:flex col-span-12 xl:col-span-5 flex-col bg-white dark:bg-slate-900 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 xl:overflow-hidden shadow-2xl`}>
                        <div className="px-5 md:px-8 py-3 md:py-5 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-amber-500/10 rounded-lg">
                                    <LightBulbIcon className="w-4 h-4 text-amber-500" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Subject_Briefing</span>
                            </div>
                            <span className="hidden sm:inline-block text-[8px] font-black px-3 py-1 bg-primary-500/10 text-primary-500 rounded-full border border-primary-500/20 uppercase tracking-widest">Active_Task</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-5 md:p-10 space-y-6 md:space-y-8 custom-scrollbar">
                            <div>
                                <h2 className="text-2xl md:text-4xl font-black text-slate-950 dark:text-white tracking-tighter leading-tight mb-3 md:mb-4">{selectedProblem.title}</h2>
                                <div className="flex flex-wrap gap-2">
                                    <span className={`text-[9px] md:text-[10px] font-black uppercase px-3 md:px-4 py-1.5 rounded-full ${selectedProblem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'}`}>
                                        Difficulty: {selectedProblem.difficulty}
                                    </span>
                                    {selectedProblem.tags?.slice(0, 3).map(tag => (
                                        <span key={tag} className="text-[9px] md:text-[10px] font-black uppercase px-3 md:px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3 md:space-y-4">
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                                    <span className="w-8 h-[1px] bg-slate-200 dark:bg-slate-800"></span> Mission_Statement
                                </span>
                                <p className="text-base md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-semibold italic border-l-[4px] md:border-l-[6px] border-primary-600/30 pl-4 md:pl-8">
                                    "{selectedProblem.description}"
                                </p>
                            </div>

                            {selectedProblem.hints && selectedProblem.hints.length > 0 && (
                                <div className="space-y-3 md:space-y-4 pt-2 md:pt-4">
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary-500 flex items-center gap-2">
                                        <span className="w-8 h-[1px] bg-primary-500/20"></span> Tactical_Advice
                                    </span>
                                    <div className="grid grid-cols-1 gap-2 md:gap-3">
                                        {selectedProblem.hints.map((hint, i) => (
                                            <div key={i} className="group p-3 md:p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-800/50 text-[10px] md:text-xs text-slate-500 font-medium italic transition-all">
                                                <span className="text-primary-500 mr-2 opacity-40">0{i + 1}_</span> {hint}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-3 md:p-4 bg-slate-50/50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 text-[8px] font-black text-slate-500 text-center uppercase tracking-[0.4em]">
                            End_of_Briefing
                        </div>
                    </div>

                    {/* Panel 3: Terminal & Source Stack (5 cols) */}
                    <div className={`${(activeMobileTab === 'code' || activeMobileTab === 'output') ? 'flex' : 'hidden'} xl:flex col-span-12 xl:col-span-5 flex-col gap-4 min-h-0`}>

                        {/* High-Performance Source Buffer */}
                        <div className={`${activeMobileTab === 'code' ? 'flex' : 'hidden'} xl:flex h-[450px] md:h-auto md:flex-1 bg-[#0d1117] rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-800 flex-col shadow-2xl relative transition-all hover:ring-primary-500/20 ring-1 ring-white/5 overflow-visible`}>
                            {/* High-Performance Integrated Header */}
                            <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between bg-[#0d1117] shrink-0 gap-4 rounded-t-[1.5rem] md:rounded-t-[2.5rem] relative z-30">
                                <div className="flex items-center gap-4">
                                    <div className="hidden sm:flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40"></div>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest whitespace-nowrap">
                                        <CommandLineIcon className="w-4 h-4 text-primary-500 opacity-50" />
                                        <span>Buffer_01.{selectedLanguage.exts}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Action Group: Random & Reset */}
                                    <div className="flex items-center bg-slate-800/50 rounded-lg p-0.5 border border-white/5">
                                        <button
                                            onClick={selectRandomProblem}
                                            title="Random Mission"
                                            className="p-1 px-2.5 text-[9px] font-black uppercase text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-md transition-all flex items-center gap-2 group"
                                        >
                                            <ArrowPathIcon className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                                            <span className="hidden lg:inline">Random</span>
                                        </button>
                                        <button
                                            onClick={() => setCode(selectedProblem.starterCode[selectedLanguage.id])}
                                            title="Clear/Reset Buffer"
                                            className="p-1 px-2.5 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-md transition-all"
                                        >
                                            <ArrowPathIcon className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    {/* Language Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/5 hover:border-primary-500/50 transition-all"
                                        >
                                            {selectedLanguage.name} <ChevronDownIcon className={`w-3 h-3 text-slate-500 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {langDropdownOpen && (
                                            <>
                                                {/* Backdrop to close on outside click */}
                                                <div
                                                    className="fixed inset-0 z-50 bg-transparent"
                                                    onClick={() => setLangDropdownOpen(false)}
                                                ></div>
                                                <div className="absolute bottom-full right-0 mb-1 w-40 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-[60] p-1 origin-bottom animate-in fade-in slide-in-from-bottom-2 duration-200">
                                                    {LANGUAGES.map(lang => (
                                                        <button
                                                            key={lang.id}
                                                            onClick={() => {
                                                                setSelectedLanguage(lang);
                                                                setLangDropdownOpen(false);
                                                            }}
                                                            className="w-full text-left px-3 py-2 hover:bg-slate-800 rounded-lg text-[9px] font-bold text-slate-400 hover:text-white flex items-center justify-between transition-colors uppercase tracking-widest"
                                                        >
                                                            {lang.name}
                                                            {selectedLanguage.id === lang.id && <CheckCircleIcon className="w-3.5 h-3.5 text-primary-500" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Primary Action */}
                                    <button
                                        onClick={runCode}
                                        className="flex items-center gap-1.5 px-4 py-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-black text-[10px] uppercase tracking-wider shadow-lg shadow-primary-500/20 transition-all active:scale-95 group"
                                    >
                                        <PlayIcon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                        <span>Execute</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 relative bg-[#0d1117] rounded-b-[1.5rem] md:rounded-b-[2.5rem] overflow-hidden">
                                <textarea
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="absolute inset-0 w-full h-full p-6 md:p-10 font-mono text-xs md:text-sm leading-relaxed resize-none bg-transparent text-slate-300 focus:outline-none placeholder-slate-800 selection:bg-primary-500/30 custom-scrollbar scroll-smooth"
                                    spellCheck="false"
                                    placeholder="// Code your tactical routine here..."
                                />
                                <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                            </div>
                        </div>

                        {/* Systems Terminal (The Integrated Output) */}
                        <div id="output-section" className={`${activeMobileTab === 'output' ? 'flex' : 'hidden'} xl:flex h-[400px] xl:h-[280px] bg-[#0a0c10] rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-800 overflow-hidden flex-col shadow-2xl relative mb-16 md:mb-0`}>
                            <div className="px-5 md:px-6 py-3 bg-[#161b22] border-b border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CommandLineIcon className="w-3.5 h-3.5 text-primary-600" />
                                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Systems_Terminal</span>
                                </div>
                                <button
                                    onClick={() => { setOutput([]); setTestResults(null); }}
                                    className="text-[8px] font-black text-slate-600 hover:text-white uppercase transition-all tracking-wider"
                                >
                                    Clear
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 md:p-6 font-mono text-[10px] md:text-xs custom-scrollbar bg-[rgba(0,0,0,0.2)]">
                                {testResults ? (
                                    <div className="grid grid-cols-1 gap-3">
                                        {testResults.map((res, i) => (
                                            <div key={i} className={`p-4 md:p-5 rounded-2xl md:rounded-3xl border transition-all ${res.passed ? 'bg-green-500/5 border-green-500/10' : 'bg-red-500/5 border-red-500/10'}`}>
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-6 h-6 md:w-8 md:h-8 rounded-xl md:rounded-2xl flex items-center justify-center ${res.passed ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                                            {res.passed ? <CheckCircleIcon className="w-4 h-4 md:w-5 md:h-5" /> : <XCircleIcon className="w-4 h-4 md:w-5 md:h-5" />}
                                                        </div>
                                                        <span className={`text-[9px] md:text-[11px] font-black uppercase tracking-widest ${res.passed ? 'text-green-500' : 'text-red-500'}`}>
                                                            T0{i + 1} • {res.passed ? 'Success' : 'Failure'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3 md:gap-4">
                                                    <div className="space-y-1">
                                                        <code className={`block px-2 md:px-3 py-1.5 md:py-2 rounded-xl bg-black/40 border border-white/5 font-bold ${res.passed ? 'text-green-400' : 'text-red-400'}`}>{res.actual}</code>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <code className="block px-2 md:px-3 py-1.5 md:py-2 rounded-xl bg-black/40 border border-white/5 text-slate-100 font-bold">{res.expected}</code>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-1 md:space-y-1.5">
                                        {output.map((line, i) => (
                                            <div key={i} className="flex gap-3 md:gap-4 group">
                                                <span className="w-6 md:w-8 text-slate-800 select-none text-right font-black opacity-20">0{i + 1}:</span>
                                                <span className={`break-all tracking-wide ${line.toLowerCase().includes('error') ? 'text-red-500' : 'text-green-500/80'}`}>{line}</span>
                                            </div>
                                        ))}
                                        {output.length === 0 && (
                                            <div className="h-full flex flex-col items-center justify-center py-12 opacity-10">
                                                <CpuChipIcon className="w-10 h-10 md:w-12 md:h-12 text-slate-500 mb-4" />
                                                <span className="text-[9px] md:text-[10px] font-black tracking-[0.6em] uppercase text-slate-500">Standby...</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
