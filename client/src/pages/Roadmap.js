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

                frontend: [
                    { title: 'Internet & Web Basics', time: '1 Week', topics: ['HTTP Verbs & Status Codes', 'DNS & Hosting Architecture', 'Browser Rendering Engine'] },
                    { title: 'HTML5 Semantic Core', time: '1 Week', topics: ['SEO Best Practices', 'ARIA & Web Accessibility', 'Web Component Basics'] },
                    { title: 'Advanced CSS Labs', time: '2 Weeks', topics: ['CSS Grid & Subgrid', 'Tailwind/SCSS Workflows', 'Custom Properties & Variables'] },
                    { title: 'Modern JS Fundamentals', time: '2 Weeks', topics: ['Closures & Lexical Scope', 'Event Loop & Concurrency', 'Modules (ESM/CJS)'] },
                    { title: 'DOM & Web APIs', time: '2 Weeks', topics: ['Web Workers', 'Intersection Observer', 'WebSockets for Client'] },
                    { title: 'React Core Architecture', time: '3 Weeks', topics: ['Virtual DOM Reconciliation', 'Fiber Architecture', 'Server Components'] },
                    { title: 'State & Logic Flow', time: '2 Weeks', topics: ['Redux Toolkit/TanStack Query', 'Optimistic UI Updates', 'Middleware Patterns'] },
                    { title: 'Performance & Security', time: '2 Weeks', topics: ['Core Web Vitals', 'XSS/CSRF Prevention', 'Code Splitting Strategies'] },
                    { title: 'Testing & Quality', time: '2 Weeks', topics: ['Jest & React Testing Library', 'Cypress E2E Buffering', 'Component Snapshotting'] },
                    { title: 'Deployment & CI/CD', time: '1 Week', topics: ['Github Actions', 'Vercel Mastery', 'Environment Workflows'] }
                ],

                backend: [
                    { title: 'System Fundamentals', time: '1 Week', topics: ['OS Internals for Devs', 'TCP/UDP Protocols', 'Reverse Proxies'] },
                    { title: 'Node.js Runtime', time: '2 Weeks', topics: ['Buffer & Stream APIs', 'Worker Threads', 'Event-Driven Patterns'] },
                    { title: 'REST & GraphQL Design', time: '3 Weeks', topics: ['API Versioning', 'Pagination & HATEOAS', 'Schema Definitions'] },
                    { title: 'Database Scalability', time: '3 Weeks', topics: ['Indexing Strategies', 'Database Normalization', 'ACID vs BASE'] },
                    { title: 'Auth Architecture', time: '2 Weeks', topics: ['OAuth 2.0 Flow', 'Refresh Token Rotation', 'RBAC & ABAC'] },
                    { title: 'Microservices & Queues', time: '3 Weeks', topics: ['RabbitMQ/Kafka', 'Circuit Breaker Pattern', 'Docker Swarm/K8s'] },
                    { title: 'Cloud Mastery', time: '3 Weeks', topics: ['Serverless Functions', 'Object Storage (S3)', 'IaC with Terraform'] },
                    { title: 'Security & Monitoring', time: '2 Weeks', topics: ['OWASP Top 10 Backend', 'ELK Stack', 'Rate Limiting Algorithms'] }
                ],

                fullstack: [
                    { title: 'Advanced UI Design', time: '4 Weeks', topics: ['Design Systems', 'Advanced Framer Motion', 'Multi-step Form Logic'] },
                    { title: 'Scalable API Engine', time: '4 Weeks', topics: ['Prisma/TypeORM Patterns', 'PostgreSQL Optimization', 'Validation Layers'] },
                    { title: 'Security Tunneling', time: '2 Weeks', topics: ['CORS & CSP Policies', 'HTTPS/SSL Management', 'Data Encryption'] },
                    { title: 'Real-time Integration', time: '2 Weeks', topics: ['Socket.io Implementations', 'Redis Caching', 'Real-time Analytics'] },
                    { title: 'Full Build & Scale', time: '4 Weeks', topics: ['CI/CD Pipelines', 'AWS Deployment', 'Zero-downtime Updates'] },
                    { title: 'Monitoring & Growth', time: '2 Weeks', topics: ['Google Analytics API', 'Error Tracking (Sentry)', 'AB Testing'] }
                ],

                ai_ml: [
                    { title: 'Math for AI/ML', time: '3 Weeks', topics: ['Vector Calculus', 'Probability Distributions', 'Matrix Decomposition'] },
                    { title: 'Scientific Computing', time: '2 Weeks', topics: ['Scikit-learn Pipelines', 'Pandas Vectorization', 'Seaborn Viz'] },
                    { title: 'Supervised Learning', time: '3 Weeks', topics: ['Gradient Descent', 'Support Vector Machines', 'Ensemble Methods'] },
                    { title: 'Neural Networks', time: '4 Weeks', topics: ['Deep Learning Theory', 'CNNs & RNNs', 'Optimization (Adam/SGD)'] },
                    { title: 'Generative AI & LLMs', time: '4 Weeks', topics: ['Transformer Architecture', 'Fine-tuning Models', 'Prompt Engineering'] },
                    { title: 'MLOps & Deployment', time: '3 Weeks', topics: ['Model Versioning (DVC)', 'BentoML/Triton', 'Inference Optimization'] }
                ],

                dataScience: [
                    { title: 'Python for Data Analysis', time: '3 Weeks', topics: ['Advanced Pandas', 'Dask for Big Data', 'Jupyter Lab Workflows'] },
                    { title: 'Statistical Mastery', time: '3 Weeks', topics: ['Parametric vs Non-parametric', 'P-value Interpretation', 'Correlation vs Causation'] },
                    { title: 'Visualization Storytelling', time: '2 Weeks', topics: ['Plotly Interactivity', 'Dashboarding Architecture', 'Data Infographics'] },
                    { title: 'Big Data Engineering', time: '4 Weeks', topics: ['Spark Streaming', 'Data Warehousing (Snowflake)', 'ETL Pipelines'] },
                    { title: 'AI for Data insight', time: '3 Weeks', topics: ['Anomaly Detection', 'Recommendation Engines', 'Clustering Logic'] }
                ],

                mobile: [
                    { title: 'Mobile Architecture', time: '3 Weeks', topics: ['MVVM & Viper Patterns', 'Stateful vs Stateless', 'Native Navigation'] },
                    { title: 'Flutter/RN Deep Dive', time: '5 Weeks', topics: ['Custom Painters', 'Bridge Architecture', 'Animation Controllers'] },
                    { title: 'Native Performance', time: '3 Weeks', topics: ['Memory Leaks Detect', 'Threading & Background Tasks', 'Database (SQLite/Realm)'] },
                    { title: 'System Services', time: '2 Weeks', topics: ['Camera API Integration', 'Biometric Auth', 'Local Notifications'] },
                    { title: 'Market Readiness', time: '2 Weeks', topics: ['Store Guidelines', 'A/B Testing on Apps', 'Crashlytics Analysis'] }
                ],

                design: [
                    { title: 'Visual Systems', time: '2 Weeks', topics: ['The Golden Ratio', 'Layout Grids & Rhythm', 'Micro-copywriting'] },
                    { title: 'Figma Engineering', time: '3 Weeks', topics: ['Advanced Components', 'Variables & Tokens', 'Developer Handoff'] },
                    { title: 'User Psychology', time: '4 Weeks', topics: ['Gestalt Principles', 'Hicks Law', 'Heuristic Evaluation'] },
                    { title: 'Prototyping Labs', time: '3 Weeks', topics: ['Conditional Logic Proto', 'Micro-animations', 'Accessibility Audit'] }
                ],

                blockchain: [
                    { title: 'Distributed Systems', time: '2 Weeks', topics: ['Consensus Algos (PoW/PoS)', 'Merkle Trees', 'Networking Overlays'] },
                    { title: 'Smart Contract Logic', time: '5 Weeks', topics: ['Solidity Security', 'Gas Optimization', 'Upgradeable Contracts'] },
                    { title: 'Web3 Ecosystem', time: '3 Weeks', topics: ['Decentralized ID', 'The Graph (Indexing)', 'EVM Architecture'] },
                    { title: 'DeFi & Asset Design', time: '4 Weeks', topics: ['Liquidity Pools', 'Oracle Networks (Chainlink)', 'DAOs'] }
                ],

                gameDev: [
                    { title: 'Engine Fundamentals', time: '4 Weeks', topics: ['Render Pipelines', 'Physics Simulation', 'Prefabs & Archetypes'] },
                    { title: 'Game Scripting Labs', time: '4 Weeks', topics: ['C# for Unity', 'AI State Machines', 'Input Systems'] },
                    { title: 'VFX & Shaders', time: '4 Weeks', topics: ['HLSL/GLSL Basics', 'Particle Systems', 'Post-processing Stack'] },
                    { title: 'Optimized Systems', time: '3 Weeks', topics: ['Occlusion Culling', 'Texture Atlasing', 'Networking (LLAPI)'] }
                ],

                devops: [
                    { title: 'Infrastructure Ops', time: '3 Weeks', topics: ['Linux Optimization', 'Shell Scripting', 'SSH/Key Management'] },
                    { title: 'IaC & Automation', time: '4 Weeks', topics: ['Terraform Workspaces', 'CloudFormation', 'Ansible Vault'] },
                    { title: 'Kubernetes Mastery', time: '5 Weeks', topics: ['Helm Charts', 'Service Meshes (Istio)', 'Ingress Controllers'] },
                    { title: 'SRE & Reliability', time: '3 Weeks', topics: ['SLAs/SLOs/SLIs', 'Chaos Engineering', 'Auto-scaling Policies'] }
                ],

                cybersecurity: [
                    { title: 'Defensive Security', time: '4 Weeks', topics: ['IDS/IPS Systems', 'SIEM Management', 'SOC Workflows'] },
                    { title: 'Offensive Strategies', time: '5 Weeks', topics: ['Penetration Testing', 'Nmap Scripting Engine', 'Reverse Engineering'] },
                    { title: 'Identity & Encryption', time: '3 Weeks', topics: ['Public Key Infra (PKI)', 'SAML/OIDC', 'Zero Trust Architecture'] },
                    { title: 'Secure App Dev', time: '3 Weeks', topics: ['DAST/SAST Integration', 'Secret Management', 'Dependency Auditing'] }
                ],

                qa: [
                    { title: 'Automation Arch', time: '4 Weeks', topics: ['Page Object Model', 'Data-driven testing', 'Parallel Execution'] },
                    { title: 'Native App Testing', time: '3 Weeks', topics: ['Appium/Detox', 'Emulators vs Physical', 'Gesture Testing'] },
                    { title: 'API & Performance', time: '3 Weeks', topics: ['k6 Performance Testing', 'Contract Testing', 'Postman Scripts'] },
                    { title: 'QA Intelligence', time: '2 Weeks', topics: ['Visual Regression', 'AI-driven Test Gen', 'CI Integration'] }
                ],

                product: [
                    { title: 'Strategy & Ops', time: '4 Weeks', topics: ['TAM/SAM/SOM', 'Pricing Strategy', 'Product-Led Growth'] },
                    { title: 'Technical Roadmap', time: '3 Weeks', topics: ['Gantt vs Agile', 'Feature Prioritization', 'MVP Definitions'] },
                    { title: 'Analytics Mastery', time: '4 Weeks', topics: ['Funnel Optimization', 'Amplitude/Mixpanel', 'Cohort Analysis'] },
                    { title: 'Team Leadership', time: '2 Weeks', topics: ['Stakeholder Mgmt', 'Conflict Resolution', 'Agility Coaching'] }
                ]
            };

            const lowerRole = role.toLowerCase();
            let key = ''; // Default fallback

            if (lowerRole.includes('front')) key = 'frontend';
            else if (lowerRole.includes('back')) key = 'backend';
            else if (lowerRole.includes('full')) key = 'fullstack';
            else if (lowerRole.includes('data')) key = 'dataScience';
            else if (lowerRole.includes('ai') || lowerRole.includes('ml') || lowerRole.includes('intell')) key = 'ai_ml';
            else if (lowerRole.includes('devops') || lowerRole.includes('cloud') || lowerRole.includes('infra')) key = 'devops';
            else if (lowerRole.includes('mobile') || lowerRole.includes('app') || lowerRole.includes('ios') || lowerRole.includes('android')) key = 'mobile';
            else if (lowerRole.includes('sec') || lowerRole.includes('cyber')) key = 'cybersecurity';
            else if (lowerRole.includes('block') || lowerRole.includes('crypto')) key = 'blockchain';
            else if (lowerRole.includes('game') || lowerRole.includes('unity') || lowerRole.includes('unreal')) key = 'gameDev';
            else if (lowerRole.includes('design') || lowerRole.includes('ui') || lowerRole.includes('ux')) key = 'design';
            else if (lowerRole.includes('test') || lowerRole.includes('qa') || lowerRole.includes('qual')) key = 'qa';
            else if (lowerRole.includes('prod') || lowerRole.includes('manage')) key = 'product';

            const selectedSteps = mockRoadmaps[key] || mockRoadmaps[' '];

            setRoadmap({
                role: role,
                steps: selectedSteps
            });

            // Save to Backend
            userApi.saveRoadmap({
                role: role,
                steps: selectedSteps.map(s => ({
                    ...s,
                    time: s.time || '1-2 Weeks',
                    topics: s.topics || ['Core Concepts', 'Best Practices', 'Exercise'],
                    status: 'pending'
                }))
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
                    <div className="flex flex-col sm:flex-row gap-4">
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
                            className="w-full sm:w-auto px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
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
                                                {step.time || '1-2 Weeks'}
                                            </span>
                                        </div>
                                        <ul className="space-y-2">
                                            {(step.topics || ['Mastering core principles', 'Real-world application', 'Project integration']).map((topic, i) => (
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
