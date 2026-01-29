import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useEffect, useState } from 'react';
import { Button } from './common';
import {
  SunIcon,
  MoonIcon,
  UserCircleIcon,
  Bars3Icon,
  ArrowRightOnRectangleIcon,
  BriefcaseIcon,
  BuildingLibraryIcon,
  AcademicCapIcon,
  BellIcon,
  HomeIcon,
  CommandLineIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid, BriefcaseIcon as BriefcaseIconSolid, BuildingLibraryIcon as BuildingLibraryIconSolid, AcademicCapIcon as AcademicCapIconSolid, UserCircleIcon as UserCircleIconSolid } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './common/Footer';

export default function Layout({ children }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [scrolled, setScrolled] = useState(false);
  const [activePopover, setActivePopover] = useState(null); // 'menu' | 'profile' | null

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-close popovers on route change
  useEffect(() => {
    setActivePopover(null);
  }, [location.pathname]);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return <>{children}</>;
  }

  const navLinkClass = "px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 rounded-xl";
  const activeLinkClass = "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400";

  const getRoleIcon = (role) => {
    switch (role) {
      case 'employer': return <BriefcaseIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />;
      case 'counselor': return <BuildingLibraryIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />;
      default: return <AcademicCapIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />;
    }
  };


  const BottomTab = ({ to, icon: Icon, activeIcon: ActiveIcon, label, active }) => (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 relative ${active ? 'text-emerald-600 dark:text-emerald-400 scale-110' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
        }`}
    >
      <div className="relative">
        {active ? <ActiveIcon className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
        {active && (
          <motion.div
            layoutId="tab-indicator"
            className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"
          />
        )}
      </div>
      <span className={`text-[10px] sm:text-[11px] font-black mt-1.5 uppercase tracking-widest ${active ? 'text-emerald-700 dark:text-emerald-400 opacity-100' : 'text-slate-500 dark:text-slate-500 opacity-80'}`}>
        {label}
      </span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans">
      {/* Bottom Navigation (Mobile Only) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
        <div className="glass-panel border border-white/20 dark:border-slate-800/50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.3)] rounded-3xl h-20 flex items-center justify-around relative overflow-hidden">
          {/* Animated Background Highlight */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none"></div>

          {/* Role-based Navigation Content */}
          {(!user || user.role === 'student') && (
            <>
              <BottomTab
                to="/dashboard"
                icon={HomeIcon}
                activeIcon={HomeIconSolid}
                label="Home"
                active={location.pathname === '/dashboard'}
              />
              <BottomTab
                to="/jobs"
                icon={BriefcaseIcon}
                activeIcon={BriefcaseIconSolid}
                label="Jobs"
                active={location.pathname === '/jobs'}
              />
              <BottomTab
                to="/colleges"
                icon={BuildingLibraryIcon}
                activeIcon={BuildingLibraryIconSolid}
                label="Colleges"
                active={location.pathname === '/colleges'}
              />
              <BottomTab
                to="/interviews"
                icon={AcademicCapIcon}
                activeIcon={AcademicCapIconSolid}
                label="Interview"
                active={location.pathname.startsWith('/interviews')}
              />
            </>
          )}

          {user?.role === 'employer' && (
            <>
              <BottomTab
                to="/dashboard"
                icon={HomeIcon}
                activeIcon={HomeIconSolid}
                label="Home"
                active={location.pathname === '/dashboard'}
              />
              <BottomTab
                to="/profile"
                icon={UserCircleIcon}
                activeIcon={UserCircleIconSolid}
                label="Profile"
                active={location.pathname === '/profile'}
              />
            </>
          )}

          {user?.role === 'counselor' && (
            <>
              <BottomTab
                to="/dashboard"
                icon={HomeIcon}
                activeIcon={HomeIconSolid}
                label="Home"
                active={location.pathname === '/dashboard'}
              />
              <BottomTab
                to="/profile"
                icon={UserCircleIcon}
                activeIcon={UserCircleIconSolid}
                label="Profile"
                active={location.pathname === '/profile'}
              />
            </>
          )}

          <button
            onClick={() => setActivePopover(activePopover === 'menu' ? null : 'menu')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 relative ${activePopover === 'menu' ? 'text-emerald-600 dark:text-emerald-400 scale-110' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}
          >
            <Bars3Icon className="w-6 h-6" />
            <span className="text-[10px] sm:text-xs font-black mt-1 uppercase tracking-tighter opacity-60">
              Menu
            </span>
          </button>
        </div>
      </div>

      {/* Compact Floating Popovers (Mobile Only) */}
      <AnimatePresence>
        {activePopover && (
          <>
            {/* Backdrop for closing */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePopover(null)}
              className="fixed inset-0 z-[60] bg-transparent"
            />

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: activePopover === 'menu' ? 20 : -20,
                originY: activePopover === 'menu' ? 'bottom' : 'top',
                originX: 'right'
              }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: activePopover === 'menu' ? 20 : -20
              }}
              className={`fixed z-[70] w-64 bg-white dark:bg-slate-950 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-2xl rounded-2xl p-2 right-4 ${activePopover === 'menu' ? 'bottom-28' : 'top-20'
                }`}
            >
              <div className="flex flex-col space-y-1">
                {activePopover === 'menu' && (
                  <>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4 py-2 border-b border-slate-100 dark:border-white/5 mb-1">Navigation Menu</p>

                    {/* Role Specific Actions in Menu */}
                    {user?.role === 'employer' && (
                      <>
                        <Link to="/applications" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors group">
                          <BriefcaseIcon className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                          <span className="font-bold text-sm">Candidates</span>
                        </Link>
                        <Link to="/jobs" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors group">
                          <AcademicCapIcon className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
                          <span className="font-bold text-sm">Post Job</span>
                        </Link>
                      </>
                    )}

                    {user?.role === 'counselor' && (
                      <>
                        <Link to="/colleges" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors group">
                          <BuildingLibraryIcon className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                          <span className="font-bold text-sm">My College</span>
                        </Link>
                        <Link to="/notifications" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors group">
                          <BellIcon className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
                          <span className="font-bold text-sm">Alerts & Notices</span>
                        </Link>
                      </>
                    )}

                    <div className="h-[1px] bg-slate-100 dark:bg-white/5 my-1 mx-2"></div>
                    {user?.role === 'student' && (
                      <>
                        <Link to="/roadmap" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors group">
                          <CommandLineIcon className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                          <span className="font-bold text-sm">Career Roadmap</span>
                        </Link>
                        <Link to="/playground" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors group">
                          <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                          <span className="font-bold text-sm">Code Arena</span>
                        </Link>
                      </>
                    )}
                  </>

                )}


                {activePopover === 'profile' && (
                  <>
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 mb-1">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{user?.name}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{user?.role}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors group">
                      <UserCircleIcon className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-sm">My Profile</span>
                    </Link>
                    <button
                      onClick={() => dispatch(logout())}
                      className="flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors w-full text-left"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      <span className="font-bold text-sm">Logout</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled
          ? 'glass-panel border-b border-slate-200/50 dark:border-slate-800/50 py-2'
          : 'bg-transparent py-4 border-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg sm:text-xl font-display">E</span>
                </div>
                <span className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">
                  EduCareer<span className="text-primary-600">.</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {/* Student Links (Default) */}
              {(!user || user.role === 'student') && (
                <>
                  <Link to="/dashboard" className={`${navLinkClass} ${location.pathname === '/dashboard' ? activeLinkClass : ''}`}>Home</Link>
                  <Link to="/jobs" className={`${navLinkClass} ${location.pathname === '/jobs' ? activeLinkClass : ''}`}>Jobs</Link>
                  <Link to="/colleges" className={`${navLinkClass} ${location.pathname === '/colleges' ? activeLinkClass : ''}`}>Colleges</Link>
                  <Link to="/interviews" className={`${navLinkClass} ${location.pathname.startsWith('/interviews') ? activeLinkClass : ''}`}>AI Interview</Link>
                </>
              )}
              {/* Employer Links */}
              {user?.role === 'employer' && (
                <>
                  <Link to="/dashboard" className={`${navLinkClass} ${location.pathname === '/dashboard' ? activeLinkClass : ''}`}>Dashboard</Link>
                  <Link to="/profile" className={`${navLinkClass} ${location.pathname === '/profile' ? activeLinkClass : ''}`}>Company Profile</Link>
                </>
              )}

              {/* Counselor Links */}
              {user?.role === 'counselor' && (
                <>
                  <Link to="/dashboard" className={`${navLinkClass} ${location.pathname === '/dashboard' ? activeLinkClass : ''}`}>Dashboard</Link>
                  <Link to="/colleges" className={`${navLinkClass} ${location.pathname === '/colleges' ? activeLinkClass : ''}`}>My College</Link>
                </>
              )}
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Notification Icon */}
              {user && (
                <Link to="/notifications" className="relative group">
                  <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                    <div className="flex items-center gap-3">
                      {/* Unread indicator dot (mock) */}
                      <BellIcon className="w-5 h-5 sm:w-6 h-6" />
                      <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                    </div>
                  </button>
                </Link>
              )}

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex w-10 h-10 rounded-xl items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                {theme === 'dark' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
              </button>

              {/* User Menu */}
              {user ? (
                <div className="flex items-center space-x-2 sm:space-x-4 pl-2 sm:pl-4 border-l border-slate-200 dark:border-slate-800">
                  <div
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        setActivePopover(activePopover === 'profile' ? null : 'profile');
                      } else {
                        navigate('/profile');
                      }
                    }}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize mt-1">{user.role}</p>
                      </div>
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors overflow-hidden shrink-0">
                        {user.profile?.avatar ? (
                          <img src={user.profile.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          getRoleIcon(user.role)
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dispatch(logout())}
                    className="hidden sm:flex text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors px-2"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" size="md" className="shadow-lg shadow-primary-500/20">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-24 md:pb-0 min-h-screen flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        <div className="mt-48 relative overflow-hidden py-24 flex flex-col items-center justify-center">
          {/* Subtle Background Branding */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
            <span className="text-[20vw] font-black uppercase tracking-tighter whitespace-nowrap select-none">
              EduCareerprep
            </span>
          </div>

          <div className="relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-200 dark:text-slate-800 uppercase tracking-tighter leading-none mb-4">
              EduCareer<span className="text-primary-500/20">prep.</span>
            </h2>
            <p className="text-slate-300 dark:text-slate-700 font-bold uppercase tracking-widest text-sm">
              Level up your professional journey
            </p>
          </div>

          <div className="mt-20 w-full">
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
}
