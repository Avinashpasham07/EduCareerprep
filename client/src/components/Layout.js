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
  ArrowRightOnRectangleIcon,
  BriefcaseIcon,
  BuildingLibraryIcon,
  AcademicCapIcon,
  BellIcon
} from '@heroicons/react/24/outline';

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
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center  ">
                  <span className="text-white font-bold text-xl font-display">E</span>
                </div>
                <span className="font-display font-bold text-xl text-slate-900 dark:text-white tracking-tight">
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
            <div className="flex items-center space-x-4">
              {/* Notification Icon */}
              {user && (
                <Link to="/notifications" className="relative group">
                  <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                    <BellIcon className="w-6 h-6" />
                    {/* Unread indicator dot (mock) */}
                    <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                  </button>
                </Link>
              )}

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                {theme === 'dark' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
              </button>

              {/* User Menu */}
              {user ? (
                <div className="flex items-center space-x-4 pl-4 border-l border-slate-200 dark:border-slate-800">
                  <Link to="/profile">
                    <div className="flex items-center space-x-3 cursor-pointer group">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize mt-1">{user.role}</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors overflow-hidden">
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
                    className="text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
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

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full glass-panel border-t border-slate-200 dark:border-slate-800 p-4 animate-fade-in-up">
              <div className="flex flex-col space-y-2">
                <Link to="/dashboard" className="p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-200" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                <Link to="/jobs" className="p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-200" onClick={() => setMobileMenuOpen(false)}>Jobs</Link>
                <Link to="/colleges" className="p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-200" onClick={() => setMobileMenuOpen(false)}>Colleges</Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="pt-24 min-h-screen">
        {children}
      </main>
    </div>
  );
}
