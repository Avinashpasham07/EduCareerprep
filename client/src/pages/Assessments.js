import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addCompletedAssessment } from '../store/slices/userActionsSlice';
import {
  CommandLineIcon,
  CalculatorIcon,
  BookOpenIcon,
  ServerIcon,
  CheckBadgeIcon,
  ClockIcon,
  ArrowRightIcon,
  XMarkIcon,
  CpuChipIcon,
  CodeBracketIcon,
  UserGroupIcon,
  GlobeAltIcon,
  BeakerIcon,
  CheckIcon,
  XMarkIcon as XMarkIconSolid
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { assessmentsData } from '../data/assessmentsData';

const CATEGORIES = ['All', 'Languages', 'Core CS', 'Aptitude', 'HR'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

const ICON_MAP = {
  CalculatorIcon: CalculatorIcon,
  BookOpenIcon: BookOpenIcon,
  CommandLineIcon: CommandLineIcon,
  ServerIcon: ServerIcon,
  CpuChipIcon: CpuChipIcon,
  CodeBracketIcon: CodeBracketIcon,
  UserGroupIcon: UserGroupIcon,
  GlobeAltIcon: GlobeAltIcon,
  BeakerIcon: BeakerIcon
};

export default function Assessments() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [assessments, setAssessments] = useState([]);
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDifficulty, setActiveDifficulty] = useState('All');
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from external data file
    setAssessments(assessmentsData);
    setFilteredAssessments(assessmentsData);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = assessments;
    if (activeCategory !== 'All') {
      filtered = filtered.filter(a => a.category === activeCategory);
    }
    if (activeDifficulty !== 'All') {
      filtered = filtered.filter(a => a.difficulty === activeDifficulty);
    }
    setFilteredAssessments(filtered);
  }, [activeCategory, activeDifficulty, assessments]);

  const startAssessment = (assessment) => {
    setCurrentAssessment(assessment);
    setCurrentQuestion(0);
    setAnswers({});
  };

  const handleAnswer = (questionId, index) => {
    if (answers[questionId] !== undefined) return;
    setAnswers(prev => ({ ...prev, [questionId]: index }));
  };

  const nextQuestion = () => {
    if (currentQuestion < currentAssessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishAssessment();
    }
  };

  const finishAssessment = () => {
    let score = 0;
    currentAssessment.questions.forEach(q => {
      const selectedIdx = answers[q.id];
      if (selectedIdx !== undefined && q.options[selectedIdx]?.value === 1) {
        score++;
      }
    });
    const percentage = Math.round((score / currentAssessment.questions.length) * 100);

    alert(`Test Submitted!\nScore: ${score}/${currentAssessment.questions.length} (${percentage}%)`);

    dispatch(addCompletedAssessment({
      id: currentAssessment.id,
      title: currentAssessment.title,
      completedDate: new Date().toISOString().split('T')[0],
      score: percentage,
      recommendations: percentage < 50 ? ["Review basics and retry."] : ["Ready for the next level!"]
    }));

    setCurrentAssessment(null);
    setAnswers({});
  };

  if (loading) return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;

  if (currentAssessment) {
    const question = currentAssessment.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / currentAssessment.questions.length) * 100;
    // Map string icon name to component
    const IconComponent = ICON_MAP[currentAssessment.iconName] || BookOpenIcon;

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 flex items-center justify-center">
        <div className="max-w-3xl w-full mx-auto px-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            {/* Exam Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                  <IconComponent className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 border border-slate-200 px-2 py-1 rounded bg-white dark:bg-slate-800">
                  Question {currentQuestion + 1}/{currentAssessment.questions.length}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                  {currentAssessment.title}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-xs font-mono text-slate-500">
                  Category: <span className="text-primary-600 font-bold">{currentAssessment.category}</span>
                </div>
                <button
                  onClick={() => setCurrentAssessment(null)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Progress Line */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1">
              <div
                className="bg-primary-600 h-1 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Question Body */}
            <div className="p-8 md:p-12">
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-8 leading-relaxed">
                {question.text}
              </h3>

              <div className="space-y-4">
                {question.options.map((opt, idx) => {
                  const isAnswered = answers[question.id] !== undefined;
                  const isSelected = answers[question.id] === idx;
                  const isCorrect = opt.value === 1;

                  let btnClass = 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300';

                  if (isAnswered) {
                    if (isCorrect) {
                      btnClass = 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400';
                    } else if (isSelected) {
                      btnClass = 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400';
                    } else {
                      btnClass = 'border-slate-200 dark:border-slate-700 opacity-50 grayscale-[0.5]';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(question.id, idx)}
                      disabled={isAnswered}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group
                        ${btnClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{opt.label}</span>
                        {isAnswered && isCorrect && <CheckCircleIcon className="w-5 h-5 text-green-500" />}
                        {isAnswered && isSelected && !isCorrect && <XCircleIcon className="w-5 h-5 text-red-500" />}
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                        ${isSelected
                          ? (isCorrect ? 'border-green-500' : 'border-red-500')
                          : 'border-slate-300 group-hover:border-primary-400'
                        }`}>
                        {isSelected && !isAnswered && <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />}
                        {isAnswered && isCorrect && <div className="w-2.5 h-2.5 rounded-full bg-green-500" />}
                        {isAnswered && isSelected && !isCorrect && <div className="w-2.5 h-2.5 rounded-full bg-red-500" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={nextQuestion}
                disabled={answers[question.id] === undefined}
                className="btn-primary-new flex items-center gap-2 px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestion === currentAssessment.questions.length - 1 ? 'Finish Exam' : 'Next Question'}
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 font-display">
            Mock Assessment Center
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Prepare for your dream job with our comprehensive library of aptitude tests, technical rounds, and coding challenges.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-col items-center gap-6 mb-12">
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 border
                  ${activeCategory === cat
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-lg transform scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Difficulty:</span>
            <div className="flex flex-wrap justify-center gap-2">
              {DIFFICULTIES.map(diff => (
                <button
                  key={diff}
                  onClick={() => setActiveDifficulty(diff)}
                  className={`px-4 py-1.5 rounded-lg font-bold text-xs transition-all duration-300 border
                    ${activeDifficulty === diff
                      ? 'bg-primary-600 text-white border-primary-600 shadow-md transform scale-105'
                      : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:border-primary-300'
                    }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Assessment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssessments.map((assessment) => {
            const Icon = ICON_MAP[assessment.iconName] || BookOpenIcon;
            return (
              <div
                key={assessment.id}
                className="card-premium group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-xl text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                      ${assessment.difficulty === 'Easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        assessment.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {assessment.difficulty}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {assessment.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2">
                    {assessment.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                      <ClockIcon className="w-4 h-4" />
                      {assessment.time}
                    </div>
                    <button
                      onClick={() => startAssessment(assessment)}
                      className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-sm hover:underline"
                    >
                      Start Test <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredAssessments.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckBadgeIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No assessments found</h3>
            <p className="text-slate-500">Try selecting a different category.</p>
          </div>
        )}

      </div>
    </div>
  );
}
