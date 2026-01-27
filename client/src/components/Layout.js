import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useEffect, useState } from 'react';
import { Button } from './common';
import {
  SunIcon,
  MoonIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  BriefcaseIcon,
  BuildingLibraryIcon,
  AcademicCapIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const MobileNavLink = ({ to, children, onClick, active }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center p-4 rounded-xl font-bold transition-all duration-200 ${active
        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
        }`}
    >
      {children}
    </Link>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans">
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
                    <BellIcon className="w-5 h-5 sm:w-6 h-6" />
                    {/* Unread indicator dot (mock) */}
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                  </button>
                </Link>
              )}

              {/* Theme Toggle (Desktop Only - accessible via mobile menu on mobile) */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="hidden sm:flex w-10 h-10 rounded-xl items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                {theme === 'dark' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
              </button>

              {/* User Menu */}
              {user ? (
                <div className="flex items-center space-x-2 sm:space-x-4 pl-2 sm:pl-4 border-l border-slate-200 dark:border-slate-800">
                  <Link to="/profile">
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
                  </Link>
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

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation Overlay */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] md:hidden"
                />

                {/* Menu Panel */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed right-0 top-0 h-full w-[80%] max-w-sm bg-white dark:bg-slate-950 z-[70] shadow-2xl md:hidden flex flex-col"
                >
                  <div className="p-6 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                      <Link to="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-lg">E</span>
                        </div>
                        <span className="font-bold text-lg text-slate-900 dark:text-white">EduCareer</span>
                      </Link>
                      <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500"
                      >
                        <XMarkIcon className="w-6 h-6" />
                      </button>
                    </div>

                    {/* User Profile Info (Mobile) */}
                    {user && (
                      <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 overflow-hidden">
                            {user.profile?.avatar ? (
                              <img src={user.profile.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              getRoleIcon(user.role)
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">{user.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex-1 overflow-y-auto space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Navigation</p>

                      {(!user || user.role === 'student') && (
                        <>
                          <MobileNavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} active={location.pathname === '/dashboard'}>Home</MobileNavLink>
                          <MobileNavLink to="/jobs" onClick={() => setMobileMenuOpen(false)} active={location.pathname === '/jobs'}>Jobs</MobileNavLink>
                          <MobileNavLink to="/colleges" onClick={() => setMobileMenuOpen(false)} active={location.pathname === '/colleges'}>Colleges</MobileNavLink>
                          <MobileNavLink to="/interviews" onClick={() => setMobileMenuOpen(false)} active={location.pathname.startsWith('/interviews')}>AI Interview</MobileNavLink>
                          <MobileNavLink to="/roadmap" onClick={() => setMobileMenuOpen(false)} active={location.pathname === '/roadmap'}>Career Roadmap</MobileNavLink>
                          <MobileNavLink to="/playground" onClick={() => setMobileMenuOpen(false)} active={location.pathname === '/playground'}>Code Arena</MobileNavLink>
                        </>
                      )}

                      {user?.role === 'employer' && (
                        <>
                          <MobileNavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} active={location.pathname === '/dashboard'}>Dashboard</MobileNavLink>
                          <MobileNavLink to="/jobs" onClick={() => setMobileMenuOpen(false)} active={location.pathname === '/jobs'}>Manage Jobs</MobileNavLink>
                          <MobileNavLink to="/profile" onClick={() => setMobileMenuOpen(false)} active={location.pathname === '/profile'}>Company Profile</MobileNavLink>
                        </>
                      )}

                      {user?.role === 'counselor' && (
                        <>
                          <MobileNavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} active={location.pathname === '/dashboard'}>Dashboard</MobileNavLink>
                          <MobileNavLink to="/colleges" onClick={() => setMobileMenuOpen(false)} active={location.pathname === '/colleges'}>My Institutions</MobileNavLink>
                        </>
                      )}

                      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Account</p>
                        <MobileNavLink to="/profile" onClick={() => setMobileMenuOpen(false)} active={location.pathname === '/profile'}>My Profile</MobileNavLink>
                        <MobileNavLink to="/notifications" onClick={() => setMobileMenuOpen(false)} active={location.pathname === '/notifications'}>Notifications</MobileNavLink>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <button
                        onClick={() => {
                          setTheme(theme === 'dark' ? 'light' : 'dark');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-bold text-sm"
                      >
                        <div className="flex items-center gap-3">
                          {theme === 'dark' ? <MoonIcon className="w-5 h-5 text-indigo-500" /> : <SunIcon className="w-5 h-5 text-amber-500" />}
                          <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                        </div>
                        <div className={`w-10 h-5 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-primary-600' : 'bg-slate-300'}`}>
                          <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${theme === 'dark' ? 'left-6' : 'left-1'}`} />
                        </div>
                      </button>

                      {user ? (
                        <button
                          onClick={() => {
                            dispatch(logout());
                            setMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-600 font-bold text-sm"
                        >
                          <ArrowRightOnRectangleIcon className="w-5 h-5" />
                          <span>Logout</span>
                        </button>
                      ) : (
                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                          <button className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20">
                            Sign In
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <main className="pt-24 min-h-screen">
        {children}
      </main>
    </div>
  );
}
