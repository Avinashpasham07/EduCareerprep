import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addCompletedAssessment } from '../store/slices/userActionsSlice';
import { userApi } from '../services/api';
import {
    LightBulbIcon,
    SparklesIcon,
    UserCircleIcon,
    BriefcaseIcon,
    PuzzlePieceIcon,
    CpuChipIcon,
    ArrowRightIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { careerAssessments as careerDataList } from '../data/careerData';

// Map icon names to components
const ICON_MAP = {
    LightBulbIcon: LightBulbIcon,
    SparklesIcon: SparklesIcon,
    UserCircleIcon: UserCircleIcon,
    BriefcaseIcon: BriefcaseIcon,
    PuzzlePieceIcon: PuzzlePieceIcon,
    CpuChipIcon: CpuChipIcon
};

// Utility to shuffle arrays (Fisher-Yates)
const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

export default function CareerAssessment() {
    const { user } = useSelector((s) => s.auth);
    const dispatch = useDispatch();
    const [assessments, setAssessments] = useState([]);
    const [currentAssessment, setCurrentAssessment] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Debug log to ensure data load
        console.log("Loading Career Data:", careerDataList);
        setAssessments(careerDataList);
        setLoading(false);
    }, []);

    const startAssessment = (assessment) => {
        // Deep clone and shuffle questions AND their respective options
        const randomizedQuestions = shuffleArray(assessment.questions).map(q => ({
            ...q,
            options: shuffleArray(q.options)
        }));

        const randomizedAssessment = {
            ...assessment,
            questions: randomizedQuestions
        };

        setCurrentAssessment(randomizedAssessment);
        setCurrentQuestion(0);
        setAnswers({});
    };

    const handleAnswer = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const nextQuestion = () => {
        if (currentQuestion < currentAssessment.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            calculateResults();
        }
    };

    const calculateResults = () => {
        const scores = {};
        currentAssessment.questions.forEach(q => {
            const val = answers[q.id] || 0;
            scores[q.category] = (scores[q.category] || 0) + val;
        });

        const sortedCategories = Object.entries(scores).sort(([, a], [, b]) => b - a);
        const topCategory = sortedCategories[0][0];

        // Detailed Recommendation Logic
        let recommendation = "";
        let details = "";

        if (currentAssessment.id === 1) { // Interest Explorer

            if (topCategory === 'frontend') {
                recommendation = "Frontend Developer or UI/UX Designer";
                details = "You have a strong eye for design and enjoy the visual aspect of technology. Consider learning React, Tailwind CSS, and Figma.";
            } else if (topCategory === 'backend') {
                recommendation = "Backend Engineer or Systems Architect";
                details = "You prefer logic, efficiency, and data structure over visuals. Focus on Node.js, Databases (SQL/NoSQL), and System Design.";
            } else if (topCategory === 'data') {
                recommendation = "Data Scientist or AI/ML Engineer";
                details = "You enjoy patterns, math, and data analysis. Python, Pandas, and Machine Learning libraries should be your next stop.";
            } else if (topCategory === 'management') {
                recommendation = "Product Manager or Tech Lead";
                details = "You excel at organizing and communicating. You might enjoy bridging the gap between coding and business strategy.";
            }
        } else if (currentAssessment.id === 2) { // Tech Specialization
            if (topCategory === 'cloud') {
                recommendation = "Cloud Engineer / DevOps Specialist";
                details = "You are suited for the modern infrastructure world. Learn AWS, Docker, Kubernetes, and CI/CD pipelines.";
            } else if (topCategory === 'security') {
                recommendation = "Cybersecurity Analyst / Ethical Hacker";
                details = "Your interest in protection and systems security is vital. Explore Network Security, Cryptography, and Penetration Testing tools.";
            } else if (topCategory === 'mobile') {
                recommendation = "Mobile App Developer (iOS/Android)";
                details = "Building apps for people's pockets excites you. Start with React Native, Flutter, Swift, or Kotlin.";
            } else if (topCategory === 'game') {
                recommendation = "Game Developer / Graphics Engineer";
                details = "You want to build worlds. Dive into Unity (C#) or Unreal Engine (C++) and learn about Linear Algebra and 3D rendering.";
            }
        } else if (currentAssessment.id === 3) { // Work Personality
            if (topCategory === 'introvert') {
                recommendation = "Independent Contributor / Remote Work";
                details = "You likely thrive in roles with deep focus time and fewer interruptions.";
            } else if (topCategory === 'team') {
                recommendation = "Agile Team Player";
                details = "You thrive in collaborative environments with frequent feedback and pair programming.";
            } else if (topCategory === 'flexible') {
                recommendation = "Startup / R&D Roles";
                details = "You adapt well to chaos and changing requirements, making you perfect for early-stage startups.";
            } else {
                recommendation = `Dominant Trait: ${topCategory.charAt(0).toUpperCase() + topCategory.slice(1)}`;
                details = "Your work style is unique. Use this self-awareness to choose teams that fit you.";
            }
        } else { // Learning Style
            recommendation = `${topCategory.charAt(0).toUpperCase() + topCategory.slice(1)} Learner`;
            if (topCategory === 'visual') details = "Use diagrams, video tutorials, and color-coded notes.";
            if (topCategory === 'auditory') details = "Discuss concepts with peers, listen to podcasts, and explain code aloud.";
            if (topCategory === 'kinesthetic') details = "Build projects, type out code manually, and experiment to learn.";
        }

        const resultData = {
            assessmentId: currentAssessment.id,
            title: currentAssessment.title,
            score: 100,
            recommendations: [recommendation]
        };

        // Save to Backend
        userApi.saveAssessment(resultData)
            .then(() => {
                dispatch(addCompletedAssessment({
                    ...resultData,
                    completedDate: new Date().toISOString().split('T')[0]
                }));
                alert(`Assessment Complete!\n\nResult: ${recommendation}\n\n${details}`);
            })
            .catch(err => {
                console.error("Failed to save result", err);
                alert("Failed to save result, but here is your feedback:\n" + recommendation);
            });

        setCurrentAssessment(null);
        setAnswers({});
    };

    if (loading) return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;

    if (currentAssessment) {
        const question = currentAssessment.questions[currentQuestion];
        const progress = ((currentQuestion + 1) / currentAssessment.questions.length) * 100;

        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 flex items-center justify-center">
                <div className="max-w-2xl w-full mx-auto px-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-black dark:text-white mb-2">{currentAssessment.title}</h2>
                                <div className="w-48 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div style={{ width: `${progress}%` }} className="h-full bg-primary-600 transition-all duration-300"></div>
                                </div>
                            </div>
                            <button onClick={() => setCurrentAssessment(null)}><XMarkIcon className="w-6 h-6 text-slate-400" /></button>
                        </div>
                        <div className="p-8">
                            <h3 className="text-xl font-medium text-slate-800 dark:text-slate-200 mb-8 leading-relaxed">{question.text}</h3>
                            <div className="space-y-3">
                                {question.options.map((opt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleAnswer(question.id, opt.value)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all ${answers[question.id] === opt.value ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                            <button
                                onClick={nextQuestion}
                                disabled={!answers[question.id]}
                                className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg font-bold disabled:opacity-50"
                            >
                                Next <ArrowRightIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-black dark:text-white mb-4 font-display">Self-Discovery & Career Fit</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">Discover who you are to find out what you should do.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assessments.map(test => {
                        const Icon = ICON_MAP[test.iconName] || LightBulbIcon;
                        return (
                            <div key={test.id} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col">
                                <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center bg-green-50 dark:bg-green-900/20 text-green-600 border border-green-100 dark:border-green-800 group-hover:scale-110 transition-transform border border-green-500`}>
                                    <Icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold text-black dark:text-white mb-3">{test.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-8 flex-grow leading-relaxed">{test.description}</p>
                                <button
                                    onClick={() => startAssessment(test)}
                                    className="w-full py-3 rounded-xl border-2 border-slate-900 dark:border-slate-700 text-slate-900 dark:text-slate-300 font-bold hover:bg-slate-900 hover:text-white dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    Start Discovery <ArrowRightIcon className="w-4 h-4" />
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
