import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addCompletedInterview } from '../store/slices/userActionsSlice';
import {
  StopIcon,
  MicrophoneIcon,
  LightBulbIcon,
  ClockIcon,
  ChartBarIcon,
  QuestionMarkCircleIcon,
  CommandLineIcon,
  CpuChipIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

export default function Interviews() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [interviews, setInterviews] = useState([]);
  const [currentInterview, setCurrentInterview] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentCodingTest, setCurrentCodingTest] = useState(0);
  const [codingAnswers, setCodingAnswers] = useState({});
  const [showCodingTests, setShowCodingTests] = useState(false);
  const [aiValidation, setAiValidation] = useState({});

  useEffect(() => {
    // Enhanced interview data with more roles and coding tests
    const mockInterviews = [
      {
        id: 1,
        title: "Software Developer Interview",
        role: "Frontend Developer",
        company: "TechCorp",
        type: "technical",
        questions: [
          "Tell me about yourself and your experience with React.",
          "How do you handle state management in large applications?",
          "Explain the difference between props and state.",
          "How would you optimize a slow React component?",
          "Describe your experience with testing frameworks."
        ],
        codingTests: [
          {
            id: 1,
            title: "React Component Challenge",
            description: "Create a counter component with increment, decrement, and reset functionality.",
            starterCode: "function Counter() {\n  // Your code here\n}",
            testCases: [
              { input: "increment", expected: "count increases by 1" },
              { input: "decrement", expected: "count decreases by 1" },
              { input: "reset", expected: "count resets to 0" }
            ]
          },
          {
            id: 2,
            title: "Array Manipulation",
            description: "Write a function to find the longest common prefix in an array of strings.",
            starterCode: "function longestCommonPrefix(strs) {\n  // Your code here\n}",
            testCases: [
              { input: "['flower', 'flow', 'flight']", expected: "'fl'" },
              { input: "['dog', 'racecar', 'car']", expected: "''" }
            ]
          }
        ],
        duration: "45 minutes",
        difficulty: "Intermediate"
      },
      {
        id: 2,
        title: "Data Analyst Interview",
        role: "Data Analyst",
        company: "Analytics Pro",
        type: "analytical",
        questions: [
          "Walk me through your data analysis process.",
          "How do you handle missing data in datasets?",
          "Explain the difference between correlation and causation.",
          "Describe your experience with SQL and Python.",
          "How would you present insights to non-technical stakeholders?"
        ],
        codingTests: [
          {
            id: 3,
            title: "SQL Query Challenge",
            description: "Write a SQL query to find the top 5 customers by total purchase amount.",
            starterCode: "SELECT ...\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\n-- Your query here",
            testCases: [
              { input: "Query execution", expected: "Returns top 5 customers with highest total" },
              { input: "Data accuracy", expected: "Correct calculations and sorting" }
            ]
          },
          {
            id: 4,
            title: "Python Data Analysis",
            description: "Write a function to calculate the correlation coefficient between two arrays.",
            starterCode: "import numpy as np\n\ndef correlation_coefficient(x, y):\n    # Your code here",
            testCases: [
              { input: "x=[1,2,3], y=[2,4,6]", expected: "1.0 (perfect positive correlation)" },
              { input: "x=[1,2,3], y=[3,2,1]", expected: "-1.0 (perfect negative correlation)" }
            ]
          }
        ],
        duration: "60 minutes",
        difficulty: "Advanced"
      },
      {
        id: 3,
        title: "Marketing Intern Interview",
        role: "Marketing Intern",
        company: "Digital Solutions",
        type: "behavioral",
        questions: [
          "Why are you interested in marketing?",
          "Describe a successful marketing campaign you've worked on.",
          "How do you measure the success of social media campaigns?",
          "What tools do you use for content creation?",
          "How do you stay updated with marketing trends?"
        ],
        codingTests: [],
        duration: "30 minutes",
        difficulty: "Beginner"
      },
      {
        id: 4,
        title: "Full Stack Developer Interview",
        role: "Full Stack Developer",
        company: "StartupXYZ",
        type: "technical",
        questions: [
          "Explain the difference between REST and GraphQL APIs.",
          "How do you handle authentication and authorization?",
          "Describe your experience with databases and ORMs.",
          "How do you ensure code quality and maintainability?",
          "What's your approach to testing in a full-stack application?"
        ],
        codingTests: [
          {
            id: 5,
            title: "API Design Challenge",
            description: "Design a REST API for a blog system with users, posts, and comments.",
            starterCode: "// Design endpoints for:\n// - User registration/login\n// - CRUD operations for posts\n// - CRUD operations for comments\n// - User authentication",
            testCases: [
              { input: "POST /api/users", expected: "Creates new user" },
              { input: "GET /api/posts", expected: "Returns all posts" },
              { input: "POST /api/posts/:id/comments", expected: "Adds comment to post" }
            ]
          },
          {
            id: 6,
            title: "Algorithm Challenge",
            description: "Implement a function to validate if a string has balanced parentheses.",
            starterCode: "function isValidParentheses(s) {\n  // Your code here\n}",
            testCases: [
              { input: "'()'", expected: "true" },
              { input: "'()[]{}'", expected: "true" },
              { input: "'(]'", expected: "false" }
            ]
          }
        ],
        duration: "75 minutes",
        difficulty: "Advanced"
      },
      {
        id: 5,
        title: "Product Manager Interview",
        role: "Product Manager",
        company: "TechGiant",
        type: "product",
        questions: [
          "How do you prioritize features in a product roadmap?",
          "Describe a time when you had to make a difficult product decision.",
          "How do you gather and analyze user feedback?",
          "What metrics do you use to measure product success?",
          "How do you work with engineering and design teams?"
        ],
        codingTests: [],
        duration: "50 minutes",
        difficulty: "Intermediate"
      },
      {
        id: 6,
        title: "DevOps Engineer Interview",
        role: "DevOps Engineer",
        company: "CloudTech",
        type: "technical",
        questions: [
          "Explain the difference between containers and virtual machines.",
          "How do you implement CI/CD pipelines?",
          "Describe your experience with cloud platforms (AWS, Azure, GCP).",
          "How do you monitor and troubleshoot production issues?",
          "What's your approach to infrastructure as code?"
        ],
        codingTests: [
          {
            id: 7,
            title: "Docker Configuration",
            description: "Create a Dockerfile for a Node.js application with proper optimization.",
            starterCode: "# Create a multi-stage Dockerfile\n# Stage 1: Build\n# Stage 2: Production",
            testCases: [
              { input: "Docker build", expected: "Successfully builds optimized image" },
              { input: "Image size", expected: "Minimal production image size" }
            ]
          }
        ],
        duration: "60 minutes",
        difficulty: "Advanced"
      }
    ];
    setInterviews(mockInterviews);
    setLoading(false);
  }, []);

  const startInterview = (interview) => {
    setCurrentInterview(interview);
    setCurrentQuestion(0);
    setCurrentCodingTest(0);
    setAnswers({});
    setCodingAnswers({});
    setShowCodingTests(false);
    setAiValidation({});
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const nextQuestion = () => {
    if (currentQuestion < currentInterview.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Check if there are coding tests
      if (currentInterview.codingTests && currentInterview.codingTests.length > 0) {
        setShowCodingTests(true);
        setCurrentCodingTest(0);
      } else {
        finishInterview();
      }
    }
  };

  const nextCodingTest = () => {
    if (currentCodingTest < currentInterview.codingTests.length - 1) {
      setCurrentCodingTest(currentCodingTest + 1);
    } else {
      finishInterview();
    }
  };

  const handleCodingAnswer = (testId, answer) => {
    setCodingAnswers(prev => ({ ...prev, [testId]: answer }));
  };

  const validateCodingAnswer = (testId) => {
    const test = currentInterview.codingTests.find(t => t.id === testId);
    const answer = codingAnswers[testId];

    if (!answer || answer.trim() === '') {
      setAiValidation(prev => ({
        ...prev,
        [testId]: {
          isValid: false,
          feedback: "Please provide your solution before validation."
        }
      }));
      return;
    }

    // Simulate AI validation
    const validation = {
      isValid: Math.random() > 0.3, // 70% chance of being valid
      feedback: Math.random() > 0.3
        ? "Great solution! Your code looks correct and handles the test cases properly."
        : "Your solution has some issues. Consider edge cases and algorithm efficiency.",
      suggestions: [
        "Consider time complexity optimization",
        "Add error handling for edge cases",
        "Use more descriptive variable names"
      ]
    };

    setAiValidation(prev => ({
      ...prev,
      [testId]: validation
    }));
  };

  const finishInterview = () => {
    // Enhanced AI feedback including coding test results
    const feedback = generateFeedback();
    const codingFeedback = generateCodingFeedback();

    const completeFeedback = `Interview Complete!

${feedback}

${codingFeedback}

Overall Assessment:
${generateOverallAssessment()}

Next Steps:
• Review the detailed feedback above
• Practice areas where you need improvement
• Take more interviews to build confidence
• Focus on coding practice if technical roles`;

    alert(completeFeedback);

    // Dispatch action to update Redux store
    dispatch(addCompletedInterview({
      id: currentInterview.id,
      title: currentInterview.title,
      role: currentInterview.role,
      completedDate: new Date().toISOString().split('T')[0],
      score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
      feedback: feedback
    }));

    // Reset interview
    setCurrentInterview(null);
    setCurrentQuestion(0);
    setCurrentCodingTest(0);
    setAnswers({});
    setCodingAnswers({});
    setShowCodingTests(false);
    setAiValidation({});
    setIsRecording(false);
  };

  const generateFeedback = () => {
    const totalQuestions = currentInterview.questions.length;
    const answeredQuestions = Object.keys(answers).length;
    const completionRate = (answeredQuestions / totalQuestions) * 100;

    let feedback = `Completion Rate: ${completionRate.toFixed(0)}%\n\n`;

    if (completionRate >= 80) {
      feedback += "Excellent! You answered most questions comprehensively.\n";
    } else if (completionRate >= 60) {
      feedback += "Good effort! Consider providing more detailed answers.\n";
    } else {
      feedback += "Try to provide more complete answers in future interviews.\n";
    }

    feedback += "\nTips for improvement:\n";
    feedback += "• Use the STAR method (Situation, Task, Action, Result)\n";
    feedback += "• Provide specific examples from your experience\n";
    feedback += "• Ask clarifying questions when needed\n";
    feedback += "• Practice common interview questions\n";

    return feedback;
  };

  const generateCodingFeedback = () => {
    if (!currentInterview.codingTests || currentInterview.codingTests.length === 0) {
      return "";
    }

    const totalTests = currentInterview.codingTests.length;
    const completedTests = Object.keys(codingAnswers).length;
    const validTests = Object.values(aiValidation).filter(v => v.isValid).length;

    let feedback = `\nCoding Test Results:\n`;
    feedback += `• Completed: ${completedTests}/${totalTests} tests\n`;
    feedback += `• Valid Solutions: ${validTests}/${completedTests} tests\n`;

    if (validTests === completedTests && completedTests > 0) {
      feedback += `• Excellent coding skills! All solutions are correct.\n`;
    } else if (validTests > completedTests / 2) {
      feedback += `• Good coding skills with room for improvement.\n`;
    } else {
      feedback += `• Focus on algorithm practice and problem-solving techniques.\n`;
    }

    return feedback;
  };

  const generateOverallAssessment = () => {
    const totalQuestions = currentInterview.questions.length;
    const answeredQuestions = Object.keys(answers).length;
    const completionRate = (answeredQuestions / totalQuestions) * 100;

    const totalTests = currentInterview.codingTests ? currentInterview.codingTests.length : 0;
    const completedTests = Object.keys(codingAnswers).length;
    const validTests = Object.values(aiValidation).filter(v => v.isValid).length;

    let assessment = "";

    if (completionRate >= 80 && (totalTests === 0 || validTests >= completedTests * 0.7)) {
      assessment = "🌟 Excellent performance! You demonstrated strong technical and communication skills.";
    } else if (completionRate >= 60 && (totalTests === 0 || validTests >= completedTests * 0.5)) {
      assessment = "👍 Good performance with some areas for improvement.";
    } else {
      assessment = "📚 Keep practicing! Focus on the areas mentioned in the feedback.";
    }

    return assessment;
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording simulation
      console.log('Recording started...');
    } else {
      // Stop recording simulation
      console.log('Recording stopped...');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading interviews...</p>
        </div>
      </div>
    );
  }

  if (currentInterview) {
    if (showCodingTests) {
      const test = currentInterview.codingTests[currentCodingTest];
      const progress = ((currentCodingTest + 1) / currentInterview.codingTests.length) * 100;
      const validation = aiValidation[test.id];

      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Coding Challenge: {test.title}
                  </h1>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {isRecording ? 'Recording' : 'Not Recording'}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Challenge {currentCodingTest + 1} of {currentInterview.codingTests.length}
                </p>
              </div>

              {/* Challenge Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {test.description}
                </h2>

                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Test Cases:</h3>
                  <div className="space-y-2">
                    {test.testCases.map((testCase, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-medium">Input:</span> {testCase.input}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-medium">Expected:</span> {testCase.expected}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Code Editor */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Solution
                </label>
                <textarea
                  value={codingAnswers[test.id] || test.starterCode}
                  onChange={(e) => handleCodingAnswer(test.id, e.target.value)}
                  rows={15}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                  placeholder="Write your code here..."
                />
              </div>

              {/* AI Validation */}
              {validation && (
                <div className={`mb-6 p-4 rounded-lg ${validation.isValid
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                  }`}>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    🤖 AI Validation Result
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {validation.feedback}
                  </p>
                  {validation.suggestions && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Suggestions:</p>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        {validation.suggestions.map((suggestion, index) => (
                          <li key={index}>• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={() => setShowCodingTests(false)}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Back to Questions
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => validateCodingAnswer(test.id)}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    🤖 Validate with AI
                  </button>
                  <button
                    onClick={nextCodingTest}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {currentCodingTest === currentInterview.codingTests.length - 1 ? 'Finish Interview' : 'Next Challenge'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const question = currentInterview.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / currentInterview.questions.length) * 100;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentInterview.title}
                </h1>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {isRecording ? 'Recording' : 'Not Recording'}
                  </span>
                </div>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Question {currentQuestion + 1} of {currentInterview.questions.length}
              </p>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                {question}
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Answer
                </label>
                <textarea
                  value={answers[currentQuestion] || ''}
                  onChange={(e) => handleAnswer(currentQuestion, e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Type your answer here or use the recording feature..."
                />
              </div>

              {/* Recording Controls */}
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={toggleRecording}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isRecording
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                >
                  <span className="flex items-center gap-2">
                    {isRecording ? <StopIcon className="w-5 h-5" /> : <MicrophoneIcon className="w-5 h-5" />}
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </span>
                </button>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Recording helps AI analyze your speech patterns and provide better feedback
                </span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentInterview(null)}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Exit Interview
              </button>
              <button
                onClick={nextQuestion}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {currentQuestion === currentInterview.questions.length - 1 ? 'Finish Interview' : 'Next Question'}
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
              <LightBulbIcon className="w-5 h-5" />
              Interview Tips
            </h3>
            <ul className="text-blue-800 dark:text-blue-200 space-y-1 text-sm">
              <li>• Use the STAR method: Situation, Task, Action, Result</li>
              <li>• Be specific and provide concrete examples</li>
              <li>• Take your time to think before answering</li>
              <li>• Ask clarifying questions if needed</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            AI Mock Interviews
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Practice with AI-powered interviews and get instant feedback to improve your skills.
          </p>
        </div>

        {/* Interview Types */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {interviews.map((interview) => (
            <div key={interview.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {interview.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${interview.type === 'technical' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      interview.type === 'analytical' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        interview.type === 'behavioral' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                          interview.type === 'product' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                    {interview.type}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  {interview.role} at {interview.company}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span className="flex items-center gap-1"><ClockIcon className="w-4 h-4" /> {interview.duration}</span>
                  <span className="flex items-center gap-1"><ChartBarIcon className="w-4 h-4" /> {interview.difficulty}</span>
                  <span className="flex items-center gap-1"><QuestionMarkCircleIcon className="w-4 h-4" /> {interview.questions.length} questions</span>
                  {interview.codingTests && interview.codingTests.length > 0 && (
                    <span className="flex items-center gap-1"><CommandLineIcon className="w-4 h-4" /> {interview.codingTests.length} coding tests</span>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Sample Questions:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  {interview.questions.slice(0, 2).map((question, index) => (
                    <li key={index} className="truncate">• {question}</li>
                  ))}
                  {interview.questions.length > 2 && (
                    <li className="text-blue-600 dark:text-blue-400">
                      +{interview.questions.length - 2} more questions
                    </li>
                  )}
                </ul>
              </div>

              {interview.codingTests && interview.codingTests.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Coding Challenges:</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    {interview.codingTests.slice(0, 2).map((test, index) => (
                      <li key={index} className="truncate">• {test.title}</li>
                    ))}
                    {interview.codingTests.length > 2 && (
                      <li className="text-blue-600 dark:text-blue-400">
                        +{interview.codingTests.length - 2} more challenges
                      </li>
                    )}
                  </ul>
                </div>
              )}

              <button
                onClick={() => startInterview(interview)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                Start Interview
              </button>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            AI-Powered Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CpuChipIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Get detailed feedback on your answers and performance.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <MicrophoneIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Voice Recording</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Practice speaking and get feedback on your communication.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Progress Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Monitor your improvement over time with detailed analytics.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrophyIcon className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Personalized Tips</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Receive customized advice based on your performance.
              </p>
            </div>
          </div>
        </div>

        {/* Practice Tips */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Interview Preparation Tips
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Before the Interview</h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2 text-sm">
                <li>• Research the company and role thoroughly</li>
                <li>• Practice common interview questions</li>
                <li>• Prepare specific examples from your experience</li>
                <li>• Test your technology and internet connection</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">During the Interview</h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2 text-sm">
                <li>• Listen carefully to each question</li>
                <li>• Take a moment to think before answering</li>
                <li>• Use the STAR method for behavioral questions</li>
                <li>• Ask thoughtful questions about the role</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
