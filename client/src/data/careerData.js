
import {
    LightBulbIcon,
    SparklesIcon,
    UserCircleIcon,
    BriefcaseIcon,
    PuzzlePieceIcon,
    GlobeAltIcon,
    CpuChipIcon,
    ShieldCheckIcon,
    DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

export const careerAssessments = [
    {
        id: 0,
        title: "High School Stream Selector (Class 10/12)",
        description: "Just finished school? Discover the right stream (Science, Commerce, Arts) or degree for you.",
        iconName: 'AcademicCapIcon',
        color: "green",
        questions: [
            // Engineering / Science (PCM)
            { id: 1, text: "I enjoy solving complex math problems and understanding physics concepts.", category: 'engineering', options: [{ label: "Strongly Disagree", value: 1 }, { label: "Neutral", value: 3 }, { label: "Strongly Agree", value: 5 }] },
            { id: 2, text: "I am curious about how machines, engines, and software work.", category: 'engineering', options: [{ label: "Strongly Disagree", value: 1 }, { label: "Neutral", value: 3 }, { label: "Strongly Agree", value: 5 }] },

            // Medical (PCB)
            { id: 3, text: "I am fascinated by human biology, anatomy, and how medicines work.", category: 'medical', options: [{ label: "Strongly Disagree", value: 1 }, { label: "Neutral", value: 3 }, { label: "Strongly Agree", value: 5 }] },
            { id: 4, text: "I want to help cure diseases or work in a hospital environment.", category: 'medical', options: [{ label: "Strongly Disagree", value: 1 }, { label: "Neutral", value: 3 }, { label: "Strongly Agree", value: 5 }] },

            // Commerce / Business
            { id: 5, text: "I am interested in how money, stock markets, and businesses operate.", category: 'commerce', options: [{ label: "Strongly Disagree", value: 1 }, { label: "Neutral", value: 3 }, { label: "Strongly Agree", value: 5 }] },
            { id: 6, text: "I like managing finances, accounting, or leading a team.", category: 'commerce', options: [{ label: "Strongly Disagree", value: 1 }, { label: "Neutral", value: 3 }, { label: "Strongly Agree", value: 5 }] },

            // Arts / Humanities / Design
            { id: 7, text: "I love history, literature, social sciences, or creative writing.", category: 'arts', options: [{ label: "Strongly Disagree", value: 1 }, { label: "Neutral", value: 3 }, { label: "Strongly Agree", value: 5 }] },
            { id: 8, text: "I enjoy visual arts, sketching, or designing creative concepts.", category: 'arts', options: [{ label: "Strongly Disagree", value: 1 }, { label: "Neutral", value: 3 }, { label: "Strongly Agree", value: 5 }] }
        ]
    },
    {
        id: 1,
        title: "Career Interest Explorer",
        description: "Analyze your interests to find the perfect technical role for you.",
        iconName: 'LightBulbIcon',
        color: "amber",
        questions: [
            // --- FRONTEND / CREATIVE (Category: 'frontend') ---
            { id: 1, text: "I enjoy spending time tweaking colors, fonts, and layouts to make things look perfect.", category: 'frontend', options: [{ label: "Strongly Disagree", value: 1 }, { label: "Neutral", value: 3 }, { label: "Strongly Agree", value: 5 }] },
            { id: 2, text: "I care deeply about user experience and how an application 'feels' when used.", category: 'frontend', options: [{ label: "Strongly Disagree", value: 1 }, { label: "Neutral", value: 3 }, { label: "Strongly Agree", value: 5 }] },
            { id: 3, text: "I like working with visual tools or design software (Figma, Photoshop) alongside coding.", category: 'frontend', options: [{ label: "Strongly Disagree", value: 1 }, { label: "Neutral", value: 3 }, { label: "Strongly Agree", value: 5 }] },

            // --- BACKEND / SYSTEMS (Category: 'backend') ---
            { id: 4, text: "I prefer working on the logic and data handling part of an application rather than the visuals.", category: 'backend', options: [{ label: "Strongly Disagree", value: 1 }, { label: "Neutral", value: 3 }, { label: "Strongly Agree", value: 5 }] },
            { id: 5, text: "I am interested in how servers, databases, and APIs communicate with each other.", category: 'backend', options: [{ label: "Strongly Disagree", value: 1 }, { label: "Neutral", value: 3 }, { label: "Strongly Agree", value: 5 }] },
            { id: 6, text: "I enjoy optimizing algorithms to make code run faster and more efficiently.", category: 'backend', options: [{ label: "Strongly Disagree", value: 1 }, { label: "Neutral", value: 3 }, { label: "Strongly Agree", value: 5 }] },

            // --- DATA SCIENCE / AI (Category: 'data') ---
            { id: 7, text: "I love mathematics, statistics, and finding patterns in large datasets.", category: 'data', options: [{ label: "Strongly Disagree", value: 1 }, { label: "Neutral", value: 3 }, { label: "Strongly Agree", value: 5 }] },
            { id: 8, text: "I am fascinated by Artificial Intelligence and machine learning models.", category: 'data', options: [{ label: "Strongly Disagree", value: 1 }, { label: "Neutral", value: 3 }, { label: "Strongly Agree", value: 5 }] },

            // --- MANAGEMENT / PRODUCT (Category: 'management') ---
            { id: 9, text: "I enjoy planning projects, defining requirements, and organizing tasks.", category: 'management', options: [{ label: "Strongly Disagree", value: 1 }, { label: "Neutral", value: 3 }, { label: "Strongly Agree", value: 5 }] },
            { id: 10, text: "I like bridging the gap between technical teams and non-technical users.", category: 'management', options: [{ label: "Strongly Disagree", value: 1 }, { label: "Neutral", value: 3 }, { label: "Strongly Agree", value: 5 }] }
        ]
    },
    {
        id: 2,
        title: "Tech Domain Specialization",
        description: "Niche down! Find out which specialized tech field suits you best.",
        iconName: 'CpuChipIcon',
        color: "indigo",
        questions: [
            // Cloud/DevOps
            { id: 1, text: "I am interested in how applications are deployed, scaled, and maintained in the cloud.", category: 'cloud', options: [{ label: "Not Interested", value: 1 }, { label: "Neutral", value: 3 }, { label: "Very Interested", value: 5 }] },
            { id: 2, text: "Automating tasks and managing infrastructure via code sounds exciting.", category: 'cloud', options: [{ label: "Not Interested", value: 1 }, { label: "Neutral", value: 3 }, { label: "Very Interested", value: 5 }] },

            // Cybersecurity
            { id: 3, text: "I enjoy finding vulnerabilities in systems and understanding how to protect them.", category: 'security', options: [{ label: "Not Interested", value: 1 }, { label: "Neutral", value: 3 }, { label: "Very Interested", value: 5 }] },
            { id: 4, text: "I am curious about encryption, ethical hacking, and network security.", category: 'security', options: [{ label: "Not Interested", value: 1 }, { label: "Neutral", value: 3 }, { label: "Very Interested", value: 5 }] },

            // Mobile
            { id: 5, text: "I interact with mobile apps constantly and want to build them.", category: 'mobile', options: [{ label: "Not Interested", value: 1 }, { label: "Neutral", value: 3 }, { label: "Very Interested", value: 5 }] },
            { id: 6, text: "I like thinking about touch gestures, small screens, and device sensors.", category: 'mobile', options: [{ label: "Not Interested", value: 1 }, { label: "Neutral", value: 3 }, { label: "Very Interested", value: 5 }] },

            // Game Dev
            { id: 7, text: "I want to create immersive interactive experiences and games.", category: 'game', options: [{ label: "Not Interested", value: 1 }, { label: "Neutral", value: 3 }, { label: "Very Interested", value: 5 }] },
            { id: 8, text: "I am interested in physics engines, 3D graphics, and game logic.", category: 'game', options: [{ label: "Not Interested", value: 1 }, { label: "Neutral", value: 3 }, { label: "Very Interested", value: 5 }] }
        ]
    },
    {
        id: 3,
        title: "Work Personality Archetype",
        description: "Understand your working style to find the right company culture.",
        iconName: 'UserCircleIcon',
        color: "purple",
        questions: [
            // Introvert/Extrovert
            { id: 1, text: "I recharge my energy by spending time alone after work.", category: 'introvert', options: [{ label: "Always", value: 5 }, { label: "Sometimes", value: 3 }, { label: "Rarely", value: 1 }] },
            { id: 2, text: "I prefer communicating via written text/email rather than phone calls.", category: 'introvert', options: [{ label: "Always", value: 5 }, { label: "Sometimes", value: 3 }, { label: "Rarely", value: 1 }] },

            // Team/Solo
            { id: 3, text: "I prefer working in a collaborative team where we constantly share ideas.", category: 'team', options: [{ label: "Always", value: 5 }, { label: "Sometimes", value: 3 }, { label: "Rarely", value: 1 }] },

            // Structure/Chaos
            { id: 4, text: "I excel in fast-paced environments where requirements change frequently (Startup mode).", category: 'flexible', options: [{ label: "Always", value: 5 }, { label: "Sometimes", value: 3 }, { label: "Rarely", value: 1 }] },

            // Leadership
            { id: 5, text: "I naturally take charge when a group is undecided on a direction.", category: 'leader', options: [{ label: "Always", value: 5 }, { label: "Sometimes", value: 3 }, { label: "Rarely", value: 1 }] }
        ]
    },
    {
        id: 4,
        title: "Learning Style Assessment",
        description: "Optimize your study habits by knowing how you learn best.",
        iconName: 'SparklesIcon',
        color: "blue",
        questions: [
            { id: 1, text: "I understand code better when I see diagrams or flowcharts.", category: 'visual', options: [{ label: "Agree", value: 5 }, { label: "Neutral", value: 3 }, { label: "Disagree", value: 1 }] },
            { id: 2, text: "I prefer watching video tutorials over reading documentation.", category: 'visual', options: [{ label: "Agree", value: 5 }, { label: "Neutral", value: 3 }, { label: "Disagree", value: 1 }] },
            { id: 3, text: "I learn best by listening to podcasts or technical talks.", category: 'auditory', options: [{ label: "Agree", value: 5 }, { label: "Neutral", value: 3 }, { label: "Disagree", value: 1 }] },
            { id: 4, text: "I learn best by building a project and making mistakes (Hands-on).", category: 'kinesthetic', options: [{ label: "Agree", value: 5 }, { label: "Neutral", value: 3 }, { label: "Disagree", value: 1 }] }
        ]
    }
];
