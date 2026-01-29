import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Tabs, ResourceCard } from '../components/common';
import ProfileHero from '../components/profile/ProfileHero';
import { userApi } from '../services/api';
import StudentProfileEditor from '../components/dashboard/StudentProfileEditor';
import CollegeProfileEditor from '../components/dashboard/CollegeProfileEditor';
import CompanyProfileEditor from '../components/dashboard/CompanyProfileEditor';

import AIResumeAnalyzer from '../components/dashboard/AIResumeAnalyzer';
import KanbanBoard from '../components/dashboard/KanbanBoard';
import {
  ChartBarIcon,
  BriefcaseIcon,
  BuildingLibraryIcon,
  DocumentCheckIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  BuildingOfficeIcon,
  PencilSquareIcon,
  SparklesIcon,
  MapPinIcon,
  AcademicCapIcon,
  DocumentIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const ICONS = {
  overview: <ChartBarIcon className="w-5 h-5" />,
  'ai-analyzer': <SparklesIcon className="w-5 h-5" />,
  savedJobs: <BriefcaseIcon className="w-5 h-5" />,
  savedColleges: <BuildingLibraryIcon className="w-5 h-5" />,
  applied: <DocumentCheckIcon className="w-5 h-5" />,
  assessments: <ClipboardDocumentListIcon className="w-5 h-5" />,
  interviews: <ChatBubbleLeftRightIcon className="w-5 h-5" />,
  empty: <ClipboardDocumentListIcon className="w-12 h-12 text-slate-300" />
};

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser } = useSelector((s) => s.auth);
  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    savedJobs = [],
    savedColleges = [],
    appliedJobs = [],
    completedAssessments = [],
    completedInterviews = []
  } = useSelector((s) => s.userActions) || {};

  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        if (id) {
          const res = await userApi.getProfileById(id);
          setTargetUser(res.data);
        } else {
          setTargetUser(currentUser);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, currentUser]);

  useEffect(() => {
    const userToUse = targetUser || currentUser;
    if (userToUse?.role === 'employer' || userToUse?.role === 'counselor') {
      const fetchStats = async () => {
        try {
          const res = await userApi.getDashboardStats(); // This might need to be specific for the target user if we want public stats
          setDashboardStats(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchStats();
    }
  }, [targetUser, currentUser]);

  // Logic to determine which user data to show
  // If an ID is in the URL, we MUST show targetUser (from API)
  // If no ID is in the URL, we show currentUser (logged-in user)
  const user = id ? targetUser : currentUser;
  const isOwnProfile = !id || id === currentUser?._id;
  const isViewingAsRecruiter = currentUser?.role === 'employer' && !isOwnProfile;

  // Define tabs with Heroicons
  const allTabs = [
    { id: 'overview', name: 'Overview', icon: ICONS.overview, roles: ['student', 'employer', 'counselor'] },
    { id: 'ai-analyzer', name: 'AI Analyzer', icon: ICONS['ai-analyzer'], roles: ['student'] },
    { id: 'saved-jobs', name: 'Saved Jobs', icon: ICONS.savedJobs, count: savedJobs.length, roles: ['student'] },
    { id: 'saved-colleges', name: 'Saved Colleges', icon: ICONS.savedColleges, count: savedColleges.length, roles: ['student'] },
    { id: 'applied-jobs', name: 'Applied Jobs', icon: ICONS.applied, count: appliedJobs.length, roles: ['student'] },
    { id: 'assessments', name: 'Assessments', icon: ICONS.assessments, count: completedAssessments.length, roles: ['student'] },
    { id: 'interviews', name: 'Interviews', icon: ICONS.interviews, count: completedInterviews.length, roles: ['student'] }
  ];

  const tabs = allTabs.filter(tab => !user?.role || tab.roles.includes(user.role));

  // Helper to render empty states
  const renderEmptyState = (icon, title, desc) => (
    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
      <div className="flex items-center justify-center mb-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-display">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm">{desc}</p>
    </div>
  );

  if (loading || (id && !targetUser)) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold animate-pulse text-sm uppercase tracking-widest">Loading Profile...</p>
        </div>
      </div>
    );
  }

  // Handle case where profile fetch failed
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center p-6 text-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">User Not Found</h2>
          <p className="text-slate-500 mb-8">We couldn't find the profile you're looking for.</p>
          <button onClick={() => window.history.back()} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold">Go Back</button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        const isStudent = user?.role === 'student' || !user?.role;
        const isEmployer = user?.role === 'employer';
        const isCounselor = user?.role === 'counselor';

        // Use user's own data for stats instead of logged-in user's Redux state (for public view)
        const statsToUse = {
          savedJobsCount: isOwnProfile ? savedJobs.length : (user?.savedJobs?.length || 0),
          savedCollegesCount: isOwnProfile ? savedColleges.length : (user?.savedColleges?.length || 0),
          appliedJobsCount: isOwnProfile ? appliedJobs.length : (user?.appliedJobs?.length || 0),
          assessmentsCount: isOwnProfile ? completedAssessments.length : (user?.completedAssessments?.length || 0),
        };

        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* --- STUDENT VIEW --- */}
            {isStudent && (
              <>
                {/* Only show private student stats to the owner */}
                {!isViewingAsRecruiter && (
                  <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatItem label="Saved Jobs" value={statsToUse.savedJobsCount} icon={<BriefcaseIcon className="w-5 h-5" />} color="emerald" />
                    <StatItem label="Colleges" value={statsToUse.savedCollegesCount} icon={<BuildingLibraryIcon className="w-5 h-5" />} color="violet" />
                    <StatItem label="Applied" value={statsToUse.appliedJobsCount} icon={<DocumentCheckIcon className="w-5 h-5" />} color="blue" />
                    <StatItem label="Tests" value={statsToUse.assessmentsCount} icon={<ClipboardDocumentListIcon className="w-5 h-5" />} color="amber" />
                  </div>
                )}

                <Card className={`p-0 h-fit border-0 shadow-2xl shadow-emerald-500/5 bg-white dark:bg-slate-900 relative overflow-hidden group ${isViewingAsRecruiter ? 'lg:col-span-3 lg:max-w-3xl mx-auto' : 'lg:row-span-2 shadow-xl shadow-slate-200/50 dark:shadow-none'}`}>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full blur-3xl -mr-20 -mt-20"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-violet-500/5 to-transparent rounded-full blur-3xl -ml-10 -mb-10"></div>

                  <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-20">
                    <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                      User Identity
                    </h3>
                    {isOwnProfile && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 rounded-xl transition-all border border-emerald-100 dark:border-emerald-500/20 shadow-sm"
                        title="Edit Profile"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="p-8 space-y-8 relative z-10">
                    <div className="grid grid-cols-1 gap-8">
                      {(user?.role === 'employer' ? [
                        { label: 'Company Name', val: user?.profile?.recruiterProfile?.companyName, full: true, icon: <BuildingOfficeIcon className="w-4 h-4" /> },
                        { label: 'Primary Email', val: user?.email, full: true, icon: <ChatBubbleLeftRightIcon className="w-4 h-4" /> },
                        { label: 'Headquarters', val: user?.profile?.location || 'Not set', icon: <MapPinIcon className="w-4 h-4" /> },
                        { label: 'Industry', val: user?.profile?.recruiterProfile?.industry || 'Not set', icon: <BriefcaseIcon className="w-4 h-4" /> },
                        { label: 'Website', val: user?.profile?.recruiterProfile?.website || 'Not set', icon: <GlobeAltIcon className="w-4 h-4" /> },
                        { label: 'Company Size', val: user?.profile?.recruiterProfile?.size || 'Not set', icon: <UserCircleIcon className="w-4 h-4" /> },
                      ] : [
                        { label: 'Full Name', val: user?.name, full: true, icon: <UserCircleIcon className="w-4 h-4" /> },
                        { label: 'Primary Email', val: user?.email, full: true, icon: <ChatBubbleLeftRightIcon className="w-4 h-4" /> },
                        { label: 'Location', val: user?.profile?.location || 'Not set', icon: <MapPinIcon className="w-4 h-4" /> },
                        { label: 'Institution', val: user?.profile?.collegeId?.name || user?.profile?.university || 'Not set', icon: <BuildingLibraryIcon className="w-4 h-4" /> },
                        { label: 'Education', val: user?.profile?.education || 'Not set', icon: <AcademicCapIcon className="w-4 h-4" /> },
                        { label: 'Graduation', val: user?.profile?.grade || user?.profile?.graduationYear || 'Not set', icon: <DocumentIcon className="w-4 h-4" /> },
                      ]).map((item, i) => (
                        <div key={i} className="group/item">
                          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2 group-hover/item:text-emerald-500 transition-colors">
                            <span className="opacity-50">{item.icon}</span>
                            {item.label}
                          </label>
                          <p className="text-base font-bold text-slate-800 dark:text-slate-200 bg-slate-50/50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5 group-hover/item:border-emerald-500/20 transition-all">
                            {item.val}
                          </p>
                        </div>
                      ))}

                      <div className="pt-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 block">
                          {user?.role === 'employer' ? 'Company Mission' : 'Professional Bio'}
                        </label>
                        <div className="p-4 bg-emerald-50/30 dark:bg-emerald-500/5 border border-emerald-100/50 dark:border-emerald-500/10 rounded-2xl">
                          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 italic">
                            "{user?.role === 'employer' ? (user?.profile?.recruiterProfile?.description || 'Build your employer brand by adding a mission statement...') : (user?.profile?.bio || 'Write a short bio to introduce yourself to recruiters...')}"
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 block">
                          {user?.role === 'employer' ? 'Perks & Benefits' : 'Skills & Expertise'}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {(user?.role === 'employer' ? user?.profile?.recruiterProfile?.benefits : user?.profile?.skills)?.length > 0 ? (
                            (user?.role === 'employer' ? user.profile.recruiterProfile.benefits : user.profile.skills).map((item, i) => (
                              <span key={i} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-wider border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-500/50 transition-colors">
                                {item}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400 italic font-medium">No details added yet</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Only show recent activity to the owner */}
                {!isViewingAsRecruiter && (
                  <div className="lg:col-span-2">
                    <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white font-display">Recent Activity</h3>
                    {(isOwnProfile ? appliedJobs : (user?.appliedJobs || [])).length > 0 ? (
                      <div className="space-y-4">
                        {(isOwnProfile ? appliedJobs : (user?.appliedJobs || [])).slice(0, 2).map((app) => (
                          <ResourceCard
                            key={app._id}
                            title={app.job?.title || 'Unknown Job'}
                            subtitle={`${app.job?.company || 'Unknown Company'} • ${app.job?.location || 'Location N/A'}`}
                            badge={<span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded border border-slate-200 dark:border-slate-700 font-medium">{app.status || 'Applied'}</span>}
                            date={app.appliedDate}
                            actionLabel="View"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-500 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-sm">
                        No recent activity to show.
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* --- EMPLOYER VIEW --- */}
            {isEmployer && (
              <>
                <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <StatItem label="Active Jobs" value={dashboardStats?.activeJobs || 0} />
                  <StatItem label="Candidates" value={dashboardStats?.totalCandidates || 0} />
                  <StatItem label="Interviews" value={dashboardStats?.interviews || 0} />
                  <StatItem label="Hired" value={dashboardStats?.hired || 0} highlight />
                </div>

                <div className="lg:col-span-2">
                  <Card className="p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display flex items-center gap-2">
                        <BuildingOfficeIcon className="w-5 h-5 text-slate-400" />
                        Company Profile
                      </h3>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-sm text-emerald-600 font-bold hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { label: 'Company Name', val: user?.profile?.recruiterProfile?.companyName || user?.name || 'Not set' },
                        { label: 'Industry', val: user?.profile?.recruiterProfile?.industry || 'Not set' },
                        { label: 'Location', val: user?.profile?.location || 'Not set' },
                        { label: 'Size', val: user?.profile?.recruiterProfile?.size || 'Not set' },
                      ].map((item, i) => (
                        <div key={i}>
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.label}</label>
                          <p className="text-slate-700 dark:text-slate-300 font-medium truncate">{item.val}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </>
            )
            }

            {/* --- COUNSELOR VIEW --- */}
            {
              isCounselor && (
                <>
                  <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <StatItem label="Students" value={dashboardStats?.totalStudents || 0} />
                    <StatItem label="Placed" value={dashboardStats?.placedStudents || 0} />
                    <StatItem label="Partners" value={dashboardStats?.activeCompanies || 0} />
                    <StatItem label="Pending" value={0} />
                  </div>

                  <div className="lg:col-span-2">
                    <Card className="p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                      <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display">Institution Profile</h3>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="text-sm text-emerald-600 font-bold hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { label: 'College Name', val: user?.name || 'Institute of Technology' },
                          { label: 'Code', val: 'INT-2024' },
                          { label: 'Email', val: user?.email },
                          { label: 'Phone', val: user?.phone || '+91 98765 43210' },
                        ].map((item, i) => (
                          <div key={i}>
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.label}</label>
                            <p className="text-slate-700 dark:text-slate-300 font-medium truncate">{item.val}</p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </>
              )
            }
          </div >
        );

      case 'ai-analyzer':
        return <AIResumeAnalyzer />;

      case 'saved-jobs':
        return savedJobs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(isOwnProfile ? savedJobs : (user?.savedJobs || [])).map(job => (
              <ResourceCard
                key={job.id || job._id}
                title={job.title}
                subtitle={`${job.company} • ${job.location}`}
                meta={job.salary}
                date={`Saved: ${job.savedDate || 'recently'}`}
                actionLabel="Apply"
              />
            ))}
          </div>
        ) : renderEmptyState(<BriefcaseIcon className="w-8 h-8 text-slate-400" />, 'No Saved Jobs', 'Jobs you bookmark will appear here.');

      case 'saved-colleges':
        return savedColleges.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(isOwnProfile ? savedColleges : (user?.savedColleges || [])).map(college => (
              <ResourceCard
                key={college.id || college._id}
                title={college.name}
                subtitle={college.location}
                badge={<span className="text-amber-600 font-bold text-xs">★ {college.rating || 'N/A'}</span>}
                date={`Saved: ${college.savedDate || 'recently'}`}
                actionLabel="View"
              />
            ))}
          </div>
        ) : renderEmptyState(<BuildingLibraryIcon className="w-8 h-8 text-slate-400" />, 'No Saved Colleges', 'Colleges you strictly interested in.');

      case 'applied-jobs':
        return appliedJobs.length > 0 ? (
          <div className="overflow-x-auto min-h-[500px]">
            <KanbanBoard jobs={appliedJobs} />
          </div>
        ) : renderEmptyState(<DocumentCheckIcon className="w-8 h-8 text-slate-400" />, 'No Applications', 'Jobs you apply for will be listed here.');

      case 'assessments':
        return completedAssessments.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {(isOwnProfile ? completedAssessments : (user?.completedAssessments || [])).map(assessment => (
              <ResourceCard
                key={assessment.id || assessment._id}
                title={assessment.title}
                subtitle="Assessment Result"
                meta={`Score: ${assessment.score}%`}
                date={assessment.completedDate}
                actionLabel="Report"
              />
            ))}
          </div>
        ) : renderEmptyState(<ClipboardDocumentListIcon className="w-8 h-8 text-slate-400" />, 'No Assessments', 'Take a skill test to verify your expertise.');

      case 'interviews':
        return completedInterviews.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {(isOwnProfile ? completedInterviews : (user?.completedInterviews || [])).map(interview => (
              <ResourceCard
                key={interview.id || interview._id}
                title={interview.title}
                subtitle={interview.role}
                meta={interview.feedback}
                badge={<span className="text-emerald-600 font-bold text-xs">{interview.score}% Score</span>}
                date={interview.completedDate}
                actionLabel="Feedback"
              />
            ))}
          </div>
        ) : renderEmptyState(<ChatBubbleLeftRightIcon className="w-8 h-8 text-slate-400" />, 'No Interviews', 'Practice interviews will show up here.');

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black pb-20">
      <ProfileHero user={user} onEdit={isOwnProfile ? () => setIsEditing(true) : undefined} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isViewingAsRecruiter && (
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            className="mb-8 sticky top-20 z-30"
          />
        )}

        <div className="animate-fade-in-up">
          {renderContent()}
        </div>

        {/* --- Edit Profile Modal --- */}
        <AnimatePresence>
          {isEditing && (
            <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-24 bg-black/60 backdrop-blur-sm overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0"
                onClick={() => setIsEditing(false)}
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-4xl z-10 my-8"
                onClick={(e) => e.stopPropagation()}
              >
                {user?.role === 'counselor' ? (
                  <CollegeProfileEditor onCancel={() => setIsEditing(false)} />
                ) : user?.role === 'employer' ? (
                  <CompanyProfileEditor onCancel={() => setIsEditing(false)} />
                ) : (
                  <StudentProfileEditor onCancel={() => setIsEditing(false)} />
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatItem({ label, value, icon, color = 'slate' }) {
  const colorStyles = {
    slate: 'bg-slate-50 text-slate-700',
    emerald: 'bg-emerald-50 text-emerald-600',
    violet: 'bg-violet-50 text-violet-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  const activeStyle = colorStyles[color] || colorStyles.slate;

  return (
    <div className="p-3 md:p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center md:items-center justify-center md:justify-start gap-3 hover:translate-y-[-2px] transition-transform duration-300">
      <div className={`p-2.5 md:p-3 rounded-xl ${activeStyle} bg-opacity-50 dark:bg-opacity-10 shrink-0`}>
        {icon || <ChartBarIcon className="w-4 h-4 md:w-5 md:h-5" />}
      </div>
      <div className="text-center md:text-left">
        <div className="text-lg md:text-2xl font-black text-slate-900 dark:text-white leading-none mb-0.5">
          {value}
        </div>
        <div className="text-[9px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</div>
      </div>
    </div>
  );
}
