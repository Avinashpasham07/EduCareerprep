import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  RocketLaunchIcon,
  ChatBubbleLeftRightIcon,
  MapIcon,
  DocumentTextIcon,
  CheckBadgeIcon,
  BuildingLibraryIcon,
  ArrowRightIcon,
  SparklesIcon,
  PlayCircleIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  BoltIcon,
  GlobeAmericasIcon,
  StarIcon
} from '@heroicons/react/24/outline';

import Footer from '../components/common/Footer';

// --- Utility Components ---

const Badge = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-md mb-8"
  >
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
    </span>
    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 tracking-wide uppercase">
      {children}
    </span>
  </motion.div>
);

const LogoTicker = () => {
  const logos = ["Join EduCareerprep.", "Join EduCareerprep.", "Join EduCareerprep.", "Join EduCareerprep.", "Join EduCareerprep.", "Join EduCareerprep.", "Join EduCareerprep.", "Join EduCareerprep."];
  return (
    <div className="w-full relative overflow-hidden py-10 border-y border-slate-100 dark:border-slate-800/50 text-transparent bg-green-100 dark:bg-slate-900/20">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10" />

      <div className="flex overflow-hidden">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex gap-16 items-center whitespace-nowrap"
        >
          {[...logos, ...logos].map((logo, i) => (
            <span key={i} className="text-xl font-bold text-slate-800 dark:text-slate-700 uppercase tracking-widest font-display hover:text-slate-400 transition-colors cursor-default">
              {logo}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default function Home() {
  const { user } = useSelector((s) => s.auth);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-primary-500/30 overflow-x-hidden">

      {/* --- HERO SECTION --- */}
      <section className="relative -mt-30 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Background Grid */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary-500 opacity-20 blur-[100px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <Badge>The #1 AI-Powered Career Platform</Badge>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 font-display leading-[1.1]"
          >
            <span className="block text-slate-900 dark:text-white mb-2">Build Your</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-emerald-500 to-indigo-600 animate-gradient-x">
              Dream Career
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed text-balance"
          >
            Unlock your potential with personalized learning paths, AI-powered mock interviews, and exclusive job opportunities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {user ? (
              <Link to="/dashboard">
                <button className="group relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold text-lg shadow-xl shadow-primary-500/10 hover:shadow-primary-500/20 hover:-translate-y-1 transition-all overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    <RocketLaunchIcon className="w-5 h-5" /> Go to Dashboard
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-indigo-600 opacity-0 group-hover:opacity-10 dark:opacity-0 transition-opacity" />
                </button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <button className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-bold text-lg shadow-lg shadow-primary-600/30 hover:-translate-y-1 transition-all flex items-center gap-2">
                    Get Started <ArrowRightIcon className="w-5 h-5" />
                  </button>
                </Link>
                <Link to="/login">
                  <button className="px-8 py-4 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-full font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2">
                    <PlayCircleIcon className="w-5 h-5" /> Demo
                  </button>
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </section>

      <LogoTicker />

      {/* --- BENTO GRID FEATURES --- */}
      <section className="py-32 bg-slate-50 dark:bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-display tracking-tight">
              Everything you need to <span className="text-primary-600">succeed.</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Our platform combines advanced AI with proven career methodologies to give you the unfair advantage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[300px]">

            {/* AI Mock Interview - Large Card */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="col-span-1 md:col-span-3 lg:col-span-8 row-span-1 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-xl flex items-center justify-center mb-4">
                    <ChatBubbleLeftRightIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">AI Mock Interviews</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-md">Practice with our real-time AI interviewer. Get feedback on tone, technical accuracy, and body language.</p>
                </div>

                {/* Mock Chat UI */}
                <div className="mt-8 space-y-3 opacity-50 group-hover:opacity-100 transition-opacity duration-500 mask-image-b">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-xs font-bold text-primary-600">AI</div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none text-xs text-slate-600 dark:text-slate-300 max-w-[80%]">
                      Can you explain the difference between REST and GraphQL?
                    </div>
                  </div>
                  <div className="flex gap-3 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">You</div>
                    <div className="bg-primary-600 text-white p-3 rounded-2xl rounded-tr-none text-xs max-w-[80%] shadow-lg shadow-primary-500/20">
                      REST is architectural style using standard HTTP methods...
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Direct Apply - Small Card */}
            <motion.div whileHover={{ y: -5 }} className="col-span-1 md:col-span-3 lg:col-span-4 row-span-1 bg-gradient-to-br from-primary-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                    <DocumentTextIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Direct Apply</h3>
                  <p className="text-primary-100 text-sm">One-click applications to partner companies. No more repetitive forms.</p>
                </div>
                <button className="w-full py-3 bg-white text-primary-700 font-bold rounded-xl mt-4 hover:bg-primary-50 transition-colors">
                  Browse Jobs
                </button>
              </div>
              <SparklesIcon className="absolute -bottom-4 -right-4 w-32 h-32 text-white opacity-10" />
            </motion.div>

            {/* Career GPS - Tall Card */}
            <motion.div whileHover={{ scale: 1.01 }} className="col-span-1 md:col-span-3 lg:col-span-4 row-span-1 bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden border border-slate-800 shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-slate-950"></div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="mb-8">
                  <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-4 border border-emerald-500/20">
                    <MapIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Career GPS</h3>
                  <p className="text-slate-400 text-sm">A personalized roadmap illustrating exactly what steps to take next.</p>
                </div>

                {/* Roadmap Visualization */}
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-800"></div>
                  <div className="space-y-6 relative">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-emerald-500 flex items-center justify-center z-10 text-xs font-bold text-emerald-500">
                          {step}
                        </div>
                        <div className="h-10 flex-1 bg-slate-800/50 rounded-lg border border-slate-700"></div>
                      </div>
                    ))}
                    <div className="flex items-center gap-4 opacity-50">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-700 z-10"></div>
                      <div className="h-10 flex-1 bg-slate-800/30 rounded-lg border border-slate-800 dashed"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Skill Verification */}
            <motion.div whileHover={{ scale: 1.02 }} className="col-span-1 md:col-span-3 lg:col-span-4 row-span-1 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center text-center group">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <CheckBadgeIcon className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Skill Verification</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Earn verified badges to stand out.</p>
            </motion.div>

            {/* College Directory */}
            <motion.div whileHover={{ scale: 1.02 }} className="col-span-1 md:col-span-6 lg:col-span-4 row-span-1 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">College Directory</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Explore placement stats & alumni.</p>
              </div>
              <div className="flex items-end justify-between mt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800"></div>)}
                </div>
                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  <ArrowRightIcon className="w-5 h-5" />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* --- MISSION SECTION (Problem vs Solution) --- */}
      <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-6">
                The Problem
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-display leading-tight">
                The <span className="text-green-500">Skills Gap</span> is widening every day.
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Millions of students graduate every year without the industry-ready skills companies actually need. Resumes get lost in black holes, and talent goes unnoticed.
              </p>
              <ul className="space-y-4">
                {[
                  "72% of graduates feel unprepared for jobs.",
                  "Recruiters spend avg. 6 seconds per resume.",
                  "Traditional degrees lag behind tech trends."
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-primary-600 rounded-3xl transform rotate-3 opacity-20 blur-xl"></div>
              <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 relative z-10 shadow-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
                  The Solution
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  EduCareer bridges the gap using AI.
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                  We don't just list jobs. We analyze your potential, recommend personalized learning paths, and verify your skills so you stand out instantly.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <BoltIcon className="w-8 h-8 text-yellow-500 mb-3" />
                    <div className="font-bold text-slate-900 dark:text-white">Instant Feedback</div>
                    <div className="text-xs text-slate-500">AI Resume analysis</div>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <GlobeAmericasIcon className="w-8 h-8 text-blue-500 mb-3" />
                    <div className="font-bold text-slate-900 dark:text-white">Global Reach</div>
                    <div className="text-xs text-slate-500">Connect worldwide</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 font-display">
              Your Journey to <span className="text-primary-600">Hired.</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              A simple, proven 4-step process to transform your career trajectory.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-slate-200 via-primary-200 to-slate-200 dark:from-slate-800 dark:via-primary-900 dark:to-slate-800"></div>

            {[
              { title: "Create Profile", desc: "Build your unified professional identity.", icon: UserGroupIcon },
              { title: "Verify Skills", desc: "Take detailed assessments to prove expertise.", icon: CheckBadgeIcon },
              { title: "AI Prep", desc: "Mock interviews & resume scoring.", icon: SparklesIcon },
              { title: "Get Hired", desc: "Direct applications to top companies.", icon: BriefcaseIcon }
            ].map((step, i) => (
              <div key={i} className="relative z-10 text-center group">
                <div className="w-24 h-24 mx-auto bg-white dark:bg-slate-900 rounded-full border-4 border-slate-50 dark:border-slate-800 shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-primary-500 transition-all duration-300">
                  <step.icon className="w-10 h-10 text-slate-400 group-hover:text-primary-600 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 px-4">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- IMPACT STATS --- */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
            {[
              { label: "Active Students", val: "10k+", icon: AcademicCapIcon },
              { label: "Partner Companies", val: "500+", icon: BuildingLibraryIcon },
              { label: "Skills Verified", val: "50k+", icon: CheckBadgeIcon },
              { label: "Hired Graduates", val: "92%", icon: RocketLaunchIcon }
            ].map((stat, i) => (
              <div key={i} className="px-4">
                <stat.icon className="w-8 h-8 text-primary-400 mx-auto mb-4 opacity-80" />
                <div className="text-4xl md:text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">{stat.val}</div>
                <div className="text-sm font-bold uppercase tracking-widest text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 font-display">
              Success Stories
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 relative">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(s => <StarIcon key={s} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-6 italic">
                  "EduCareer transformed my job search. The AI mock interviews gave me the confidence I needed to crack my Google interview."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Alex Johnson</div>
                    <div className="text-xs text-slate-500">SDE @ Google</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-white">
          <div className="absolute inset-0 bg-white bg-[size:24px_24px] opacity-20"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary-600/30 rounded-full blur-[120px] pointer-events-none"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
          <h2 className="text-5xl md:text-7xl font-bold text-black mb-8 font-display tracking-tight leading-tight">
            Ready to launch your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-black to-slate-400">career journey?</span>
          </h2>
          <p className="text-xl text-black mb-12 max-w-2xl mx-auto">
            Join 10,000+ students and recruiters connecting on EduCareer today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <button className="px-10 py-5 bg-black text-white text-lg border-2 border-green-500 font-bold rounded-full shadow-2xl ">
                Start Now - It's Free
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <Footer />
    </div >
  );
}