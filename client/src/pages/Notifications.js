import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  BellIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  CurrencyRupeeIcon,
  ClipboardDocumentCheckIcon,
  ChatBubbleLeftRightIcon,
  ExclamationCircleIcon,
  ClockIcon,
  EnvelopeOpenIcon
} from '@heroicons/react/24/outline';
import { userApi } from '../services/api';

export default function Notifications() {
  const { user } = useSelector((s) => s.auth);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await userApi.getNotifications();
        setNotifications(res.data);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const formatTimestamp = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'admission': return <AcademicCapIcon className="w-6 h-6" />;
      case 'scholarship': return <CurrencyRupeeIcon className="w-6 h-6" />;
      case 'exam': return <ClipboardDocumentCheckIcon className="w-6 h-6" />;
      case 'job': return <BriefcaseIcon className="w-6 h-6" />;
      case 'assessment': return <ClipboardDocumentCheckIcon className="w-6 h-6" />;
      case 'interview': return <ChatBubbleLeftRightIcon className="w-6 h-6" />;
      default: return <BellIcon className="w-6 h-6" />;
    }
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'admission': return 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50';
      case 'scholarship': return 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50';
      case 'exam': return 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50';
      case 'job': return 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900/50';
      case 'assessment': return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/50';
      case 'interview': return 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-900/50';
      default: return 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
  };

  const getPriorityBorder = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-l-red-500';
      case 'medium': return 'border-l-4 border-l-amber-500';
      case 'low': return 'border-l-4 border-l-green-500';
      default: return 'border-l-4 border-l-slate-300';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const markAsRead = async (id) => {
    try {
      await userApi.markNotifAsRead(id);
      setNotifications(prev =>
        prev.map(notification =>
          (notification.id || notification._id) === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await userApi.markAllNotifsAsRead();
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2 font-display">
              Notifications
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Stay updated with admissions, scholarships, exams, and career opportunities.
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="self-start md:self-center px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-primary-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2"
            >
              <EnvelopeOpenIcon className="w-4 h-4" /> Mark All as Read
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', count: notifications.length, icon: <BellIcon className="w-5 h-5" />, color: 'blue' },
            { label: 'Unread', count: unreadCount, icon: <ExclamationCircleIcon className="w-5 h-5" />, color: 'red' },
            { label: 'Admissions', count: notifications.filter(n => n.type === 'admission').length, icon: <AcademicCapIcon className="w-5 h-5" />, color: 'green' },
            { label: 'Jobs', count: notifications.filter(n => n.type === 'job').length, icon: <BriefcaseIcon className="w-5 h-5" />, color: 'purple' },
          ].map((stat, i) => {
            const colorClasses = {
              blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
              red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
              green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
              purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
            };
            return (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                <div className={`p-2.5 rounded-lg ${colorClasses[stat.color]}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-black dark:text-white">{stat.count}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-2 mb-6 overflow-x-auto">
          <div className="flex gap-1 min-w-max p-1">
            {['all', 'unread', 'admission', 'scholarship', 'job'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all capitalize ${filter === f
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id || notification._id}
              className={`group bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md ${getPriorityBorder(notification.priority)} ${!notification.read ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''
                }`}
            >
              <div className="p-5">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 pt-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${getTypeStyles(notification.type)}`}>
                      {getTypeIcon(notification.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className={`text-base font-bold ${!notification.read ? 'text-black dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 animate-pulse"></span>
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 leading-relaxed">
                      {notification.message}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                        <ClockIcon className="w-3.5 h-3.5" /> {formatTimestamp(notification.createdAt)}
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => markAsRead(notification.id || notification._id)}
                          className="text-xs font-bold text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors"
                        >
                          {!notification.read && 'Mark as Read'}
                        </button>
                        {notification.link && (
                          <button
                            onClick={() => window.location.href = notification.link}
                            className="px-4 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                          >
                            View
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <BellIcon className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              No notifications found
            </h3>
            <p className="text-slate-500 text-sm">
              {filter === 'unread'
                ? 'You\'re all caught up! No unread notifications.'
                : 'No notifications match your current filter.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
