import { useState, useEffect } from 'react';
import {
    CheckCircleIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import { userApi } from '../services/api';

export default function Roadmap() {
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [roadmap, setRoadmap] = useState(null);

    const generateRoadmap = () => {
        if (!role) return;
        setLoading(true);

        // Mock AI Generation - in real app, call Gemini API
        setTimeout(() => {
            const mockRoadmaps = {
                'frontend': [
                    { title: 'HTML & CSS Fundamentals', time: 'Week 1-2', topics: ['Semantic HTML', 'Flexbox/Grid', 'Responsive Design'] },
                    { title: 'JavaScript Basics', time: 'Week 3-5', topics: ['ES6+', 'DOM Manipulation', 'Async/Await'] },
                    { title: 'React.js Mastery', time: 'Week 6-10', topics: ['Hooks', 'State Management (Redux)', 'Routing'] },
                    { title: 'Build Projects', time: 'Week 11-12', topics: ['Portfolio Website', 'E-commerce Clone'] }
                ],
                'backend': [
                    { title: 'Server Basics (Node.js)', time: 'Week 1-3', topics: ['Event Loop', 'Modules', 'File System'] },
                    { title: 'Express & APIs', time: 'Week 4-6', topics: ['REST Architecture', 'Middleware', 'Authentication'] },
                    { title: 'Databases (MongoDB/SQL)', time: 'Week 7-9', topics: ['Schemas', 'Aggregation', 'Transactions'] },
                    { title: 'Deployment', time: 'Week 10', topics: ['AWS/Heroku', 'Docker Basics', 'CI/CD'] }
                ],
                'data': [
                    { title: 'Python & Math', time: 'Week 1-4', topics: ['Python Syntax', 'Linear Algebra', 'Statistics'] },
                    { title: 'Data Analysis', time: 'Week 5-8', topics: ['Pandas', 'NumPy', 'Data Visualization (Matplotlib)'] },
                    { title: 'Machine Learning Basics', time: 'Week 9-12', topics: ['Scikit-Learn', 'Regression', 'Classification'] },
                    { title: 'Deep Learning & Projects', time: 'Week 13+', topics: ['TensorFlow/PyTorch', 'Neural Networks', 'Kaggle Competitions'] }
                ],
                'devops': [
                    { title: 'Linux & Scripting', time: 'Week 1-3', topics: ['Shell Scripting', 'File Permissions', 'Networking Basics'] },
                    { title: 'Containerization', time: 'Week 4-6', topics: ['Docker', 'Docker Compose', 'Container Registries'] },
                    { title: 'CI/CD Pipelines', time: 'Week 7-9', topics: ['GitHub Actions', 'Jenkins', 'Automated Testing'] },
                    { title: 'Orchestration & Cloud', time: 'Week 10-12', topics: ['Kubernetes', 'AWS/Azure Basics', 'Terraform'] }
                ],
                'mobile': [
                    { title: 'Language Basics', time: 'Week 1-4', topics: ['Swift (iOS) or Kotlin (Android)', 'OOP Concepts'] },
                    { title: 'UI Development', time: 'Week 5-8', topics: ['Layouts', 'Views', 'Responsive UI'] },
                    { title: 'State & Networking', time: 'Week 9-11', topics: ['State Management', 'API Integration', 'Local Storage'] },
                    { title: 'Publishing', time: 'Week 12', topics: ['App Store Guidelines', 'Beta Testing', 'CI/CD for Mobile'] }
                ],
                'security': [
                    { title: 'Networking Fundamentals', time: 'Week 1-3', topics: ['OSI Model', 'TCP/IP', 'DNS', 'HTTP/HTTPS'] },
                    { title: 'System Security', time: 'Week 4-6', topics: ['Linux Security', 'Windows Internals', 'Cryptography'] },
                    { title: 'Web Security', time: 'Week 7-9', topics: ['OWASP Top 10', 'Burp Suite', 'SQL Injection', 'XSS'] },
                    { title: 'Penetration Testing', time: 'Week 10-12', topics: ['Reconnaissance', 'Exploitation', 'Reporting'] }
                ],
                'design': [
                    { title: 'Design Principles', time: 'Week 1-3', topics: ['Color Theory', 'Typography', 'Visual Hierarchy'] },
                    { title: 'UX Research', time: 'Week 4-6', topics: ['User Personas', 'User Journey Maps', 'Usability Testing'] },
                    { title: 'Wireframing & Prototyping', time: 'Week 7-9', topics: ['Figma Mastery', 'Low/High Fidelity', 'Interactions'] },
                    { title: 'Design Systems', time: 'Week 10-12', topics: ['Component Libraries', 'Auto Layout', 'Developer Handoff'] }
                ],
                'default': [
                    { title: 'Foundations', time: 'Month 1', topics: ['Core Concepts', 'Basic Syntax', 'Simple Tools'] },
                    { title: 'Intermediate Skills', time: 'Month 2', topics: ['Frameworks', 'Best Practices', 'Debugging'] },
                    { title: 'Advanced & Projects', time: 'Month 3', topics: ['Complex Logic', 'System Design', 'Real-world Capstone'] }
                ]
            };

            const lowerRole = role.toLowerCase();
            let key = 'default';
            if (lowerRole.includes('front')) key = 'frontend';
            else if (lowerRole.includes('back')) key = 'backend';
            else if (lowerRole.includes('data')) key = 'data';
            else if (lowerRole.includes('scien')) key = 'data';
            else if (lowerRole.includes('devops') || lowerRole.includes('cloud')) key = 'devops';
            else if (lowerRole.includes('mobile') || lowerRole.includes('app') || lowerRole.includes('ios') || lowerRole.includes('android')) key = 'mobile';
            else if (lowerRole.includes('sec') || lowerRole.includes('cyber')) key = 'security';
            else if (lowerRole.includes('ui') || lowerRole.includes('ux') || lowerRole.includes('design')) key = 'design';

            setRoadmap({
                role: role,
                steps: mockRoadmaps[key]
            });

            // Save to Backend
            userApi.saveRoadmap({
                role: role,
                steps: mockRoadmaps[key].map(s => ({ ...s, status: 'pending' }))
            }).catch(console.error);

            setLoading(false);
        }, 1500);
    };

    // Load saved roadmaps on mount
    useEffect(() => {
        // Just checking if we have any active roadmap to show?
        // For now, let's just fetch and if one exists, show the last one?
        // Or maybe show a list? The UI is designed for one.
        // Let's try to load the most recent one.
        userApi.getRoadmaps()
            .then(res => {
                if (res.data && res.data.length > 0) {
                    const last = res.data[res.data.length - 1]; // Get latest
                    setRoadmap(last);
                    setRole(last.role);
                }
            })
            .catch(err => console.error("Failed to load roadmaps", err));
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-black pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl mb-4 text-green-600 dark:text-green-400">
                        <SparklesIcon className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-bold text-black dark:text-white mb-4 font-display">
                        AI Roadmap Generator
                    </h1>
                    <p className="text-lg text-black dark:text-white max-w-2xl mx-auto">
                        Not sure where to start? Enter your dream role, and our AI will create a personalized step-by-step learning path for you.
                    </p>
                </div>

                {/* Input Section */}
                <div className="bg-white dark:bg-black p-8 rounded-2xl border border-green-200 dark:border-green-800 shadow-xl mb-12 max-w-2xl mx-auto">
                    <label className="block text-sm font-bold text-black dark:text-white mb-2">
                        What do you want to become?
                    </label>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="e.g. Frontend Developer, Data Scientist, UX Designer"
                            className="flex-1 px-4 py-3 rounded-xl border border-green-300 dark:border-green-700 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                            onKeyDown={(e) => e.key === 'Enter' && generateRoadmap()}
                        />
                        <button
                            onClick={generateRoadmap}
                            disabled={!role || loading}
                            className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Generate <SparklesIcon className="w-5 h-5" /></>
                            )}
                        </button>
                    </div>
                </div>

                {/* Roadmap Display */}
                {roadmap && (
                    <div className="animate-fade-in-up">
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-2xl font-bold text-black dark:text-white font-display">
                                Your Path to {roadmap.role}
                            </h2>
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold uppercase rounded-full">
                                AI Generated
                            </span>
                        </div>

                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-green-200 dark:before:via-green-900 before:to-transparent">
                            {roadmap.steps.map((step, index) => (
                                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                                    {/* Icon */}
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-black bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                        <span className="font-bold text-sm">{index + 1}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-black p-6 rounded-2xl border border-green-200 dark:border-green-800 shadow-sm hover:shadow-md hover:border-green-300 dark:hover:border-green-700/50 transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-black dark:text-white">{step.title}</h3>
                                            <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                                                {step.time}
                                            </span>
                                        </div>
                                        <ul className="space-y-2">
                                            {step.topics.map((topic, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm text-black dark:text-white">
                                                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                                                    {topic}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
