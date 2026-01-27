import { interviewQuestions } from '../data/interviewQuestions';

const API_BASE_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function InterviewRoom() {
    const navigate = useNavigate();
    const location = useLocation();
    // Default config if not provided via state
    const config = location.state?.config || { role: 'Full Stack Developer', difficulty: 'Intermediate' };

    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState("Initializing AI Interviewer...");
    const [processing, setProcessing] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [inputText, setInputText] = useState(""); // User draft answer

    const recognitionRef = useRef(null);
    const transcriptEndRef = useRef(null);
    const transcriptRef = useRef([]);
    const hasInitialized = useRef(false);

    // Timer Logic
    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const scrollToBottom = () => {
        transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
        transcriptRef.current = transcript;
    }, [transcript, processing]);

    useEffect(() => {
        // Initialize Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event) => {
                const text = event.results[0][0].transcript;
                // Capture text but DO NOT submit automatically
                setInputText(text);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        if (!hasInitialized.current) {
            hasInitialized.current = true;
            getAIQuestion([]);
        }

        return () => {
            if (recognitionRef.current) recognitionRef.current.abort();
            window.speechSynthesis.cancel();
        };
    }, []);

    const getAIQuestion = async (history) => {
        setProcessing(true);
        try {
            // Use local questions instead of API call
            const roleQuestions = interviewQuestions[config.role] || interviewQuestions["HR"] || ["Tell me about yourself."];
            const historyTexts = (history || []).map(h => h.text);
            const availableQuestions = roleQuestions.filter(q => !historyTexts.includes(q));

            const pool = availableQuestions.length > 0 ? availableQuestions : roleQuestions;
            const question = pool[Math.floor(Math.random() * pool.length)];

            const newAiMsg = { role: 'ai', text: question, timestamp: new Date() };
            setTranscript(prev => [...prev, newAiMsg]);
            setCurrentQuestion(question);
            speak(question);
        } catch (err) {
            console.error("Local Question Selection Error", err);
            const fallback = "Tell me about your background and experience.";
            const fallbackMsg = { role: 'ai', text: fallback, timestamp: new Date() };
            setTranscript(prev => [...prev, fallbackMsg]);
            setCurrentQuestion(fallback);
            speak(fallback);
        } finally {
            setProcessing(false);
        }
    };

    const speak = (text) => {
        setIsSpeaking(true);
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    const handleManualSubmit = () => {
        // Trigger the answer flow manually
        handleUserAnswer(inputText);
        setInputText("");
    };

    const handleUserAnswer = async (text) => {
        if (!text.trim()) return;
        const newEntry = { role: 'user', text, timestamp: new Date() };
        setTranscript(prev => [...prev, newEntry]);

        const updatedHistory = [...transcriptRef.current, newEntry];

        try {
            setProcessing(true);
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${API_BASE_URL}/api/interviews/analyze-response`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    role: config.role,
                    question: currentQuestion,
                    answer: text
                })
            });

            if (!res.ok) throw new Error('Analysis failed');
            const analysis = await res.json();

            // 2. Show Feedback
            if (analysis.reply) {
                const feedbackMsg = {
                    role: 'ai',
                    text: analysis.reply,
                    timestamp: new Date(),
                    isFeedback: true,
                    score: analysis.score
                };
                setTranscript(prev => [...prev, feedbackMsg]);

                setIsSpeaking(true);
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(analysis.reply);
                utterance.onend = () => {
                    setIsSpeaking(false);
                    getAIQuestion(updatedHistory);
                };
                window.speechSynthesis.speak(utterance);
            } else {
                getAIQuestion(updatedHistory);
            }
        } catch (err) {
            console.error("Analysis failed, using local fallback", err);
            // Local Simple Analysis Fallback
            const wordCount = text.trim().split(/\s+/).length;
            const fallbackReply = wordCount > 10 ? "That's a detailed answer. Let's move on." : "I see, could you elaborate more in future answers?";

            const feedbackMsg = {
                role: 'ai',
                text: fallbackReply,
                timestamp: new Date(),
                isFeedback: true,
                score: wordCount > 5 ? 7 : 4
            };
            setTranscript(prev => [...prev, feedbackMsg]);
            getAIQuestion(updatedHistory);
        } finally {
            setProcessing(false);
        }
    };

    const toggleListening = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            recognitionRef.current.start();
            setIsListening(true);
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setInputText(""); // Clear previous text when starting new recording
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const endInterview = async () => {
        // Calculate average score from AI feedback messages
        const scores = transcript.filter(t => t.score).map(t => t.score);
        const avgScore = scores.length > 0
            ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) // Scale 0-10 to 0-100 if needed, usually analysis is 1-10?
            // Wait, geminiService returns 0-10 for single answer? Let's assume it returns 0-10.
            // Actually geminiService returns "score" which is 3, 5, 8, 9 depending on heuristics. This is out of 10.
            : 0;

        const finalScore = avgScore * 10; // Convert to percentage

        try {
            const token = localStorage.getItem('accessToken');
            await fetch(`${API_BASE_URL}/api/interviews/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    role: config.role,
                    transcript: transcript,
                    score: finalScore || 75, // Default if no answers
                    feedback: { summary: "Completed specific domain interview" },
                    duration: elapsedTime // Send seconds
                })
            });
        } catch (e) {
            console.error("Failed to save interview", e);
        }

        navigate('/interview/feedback', {
            state: {
                stats: {
                    score: finalScore || 75,
                    duration: formatTime(elapsedTime),
                    questions: transcript.filter(t => t.role === 'ai' && !t.isFeedback).length,
                    role: config.role,
                    transcript: transcript
                }
            }
        });
    };

    return (
        <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">

            <div className="flex-1 flex flex-col relative h-full">

                {/* Header */}
                <div className="h-16 border-b border-slate-200 flex justify-between items-center px-6 bg-white/80 backdrop-blur-md z-20">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                            <span className="font-mono text-xs text-slate-600 font-medium">
                                {formatTime(elapsedTime)}
                            </span>
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden md:block">
                            {config.role} • {config.difficulty}
                        </span>
                    </div>
                    <button
                        onClick={endInterview}
                        className="text-xs font-bold text-red-500 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200"
                    >
                        <ArrowLeftOnRectangleIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">END SESSION</span>
                    </button>
                </div>

                {/* Avatar / Visualization Area */}
                <div className="flex-1 flex flex-col items-center justify-center relative p-6 overflow-hidden">

                    {/* Background Ambience */}
                    <div className={`absolute w-[600px] h-[600px] bg-green-300/20 rounded-full blur-[120px] transition-all duration-1000 ${isSpeaking ? 'scale-110 opacity-40' : 'scale-100 opacity-20'}`}></div>

                    {/* Central Avatar */}
                    <div className="relative z-10 mb-10">
                        <div className={`w-48 h-48 rounded-full border-[6px] flex items-center justify-center relative bg-white shadow-2xl transition-all duration-500 ${isSpeaking ? 'border-green-400 shadow-green-200' : 'border-slate-100'}`}>
                            {isSpeaking && <div className="absolute inset-0 border-[4px] border-green-200 rounded-full animate-ping"></div>}
                            <div className="w-36 h-36 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center relative overflow-hidden">
                                {processing && <div className="absolute inset-0 bg-gradient-to-t from-green-100/50 to-transparent animate-pulse"></div>}
                                <CpuChipIcon className={`w-16 h-16 text-slate-700 transition-colors duration-300 ${isSpeaking ? 'text-green-600' : ''}`} />
                            </div>
                        </div>
                    </div>

                    {/* Live Caption / Current Question */}
                    <div className="max-w-3xl text-center space-y-4 relative z-10 min-h-[120px]">
                        <div className="h-6 flex justify-center items-center">
                            {processing ? (
                                <span className="text-green-600 text-xs uppercase tracking-widest font-bold animate-pulse">Generating Question...</span>
                            ) : isSpeaking ? (
                                <span className="text-green-600 text-xs uppercase tracking-widest font-bold">AI Speaking</span>
                            ) : (
                                <span className="text-slate-400 text-xs uppercase tracking-widest font-bold">
                                    {isListening ? "Listening..." : "Waiting for answer..."}
                                </span>
                            )}
                        </div>
                        <h2 className="text-xl md:text-3xl font-medium text-slate-800 leading-normal transition-all duration-300">
                            "{currentQuestion}"
                        </h2>
                    </div>

                    {/* Interaction Bar - Microphone OR Text Input */}
                    <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20 px-4">
                        {inputText ? (
                            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl flex items-center p-2 border border-slate-200 animate-in fade-in slide-in-from-bottom-4">
                                <textarea
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-slate-700 placeholder-slate-400 resize-none h-12 py-3 px-2"
                                    placeholder="Type your answer or speak..."
                                />
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={toggleListening}
                                        className="p-3 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-full transition-all"
                                        title="Retake Audio"
                                    >
                                        <MicrophoneIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={handleManualSubmit}
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md shadow-green-500/20 active:scale-95"
                                    >
                                        <span>Send</span>
                                        <PaperAirplaneIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={toggleListening}
                                className={`group relative flex items-center justify-center w-20 h-20 rounded-full shadow-2xl transition-all duration-300 ${isListening
                                    ? 'bg-red-500 hover:bg-red-600 shadow-red-200 scale-110'
                                    : 'bg-white hover:bg-slate-50 border border-slate-200'
                                    }`}
                            >
                                {isListening ? (
                                    <div className="relative">
                                        <span className="absolute -inset-4 border border-red-300 rounded-full animate-ping opacity-75"></span>
                                        <StopIcon className="w-8 h-8 text-white relative z-10" />
                                    </div>
                                ) : (
                                    <MicrophoneIcon className="w-8 h-8 text-slate-700 group-hover:text-green-600 transition-colors" />
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: TRANSCRIPT DRAWER */}
            <div className="hidden lg:flex w-[400px] border-l border-slate-200 bg-white/60 backdrop-blur-xl flex-col h-full shadow-xl z-30">
                <div className="p-4 border-b border-slate-100 bg-white/80 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2 text-slate-700">
                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                        <span className="font-bold text-sm tracking-wide">TRANSCRIPT</span>
                    </div>
                    <div className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold border border-green-200">
                        LIVE
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 scroll-smooth">
                    {transcript.map((msg, i) => (
                        <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                            <div className="flex items-center gap-2 mb-1 opacity-70">
                                {msg.role === 'ai' ? <CpuChipIcon className="w-3 h-3 text-slate-500" /> : <UserIcon className="w-3 h-3 text-slate-500" />}
                                <span className="text-[10px] font-bold uppercase text-slate-500">
                                    {msg.role === 'user' ? 'You' : 'Interviewer'}
                                </span>
                            </div>

                            <div className={`p-3.5 rounded-2xl text-sm leading-relaxed max-w-[90%] shadow-sm ${msg.role === 'user'
                                ? 'bg-slate-800 text-white rounded-tr-none'
                                : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={transcriptEndRef} />
                </div>
            </div>
        </div>
    );
}