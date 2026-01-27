import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addSavedJob, addAppliedJob } from '../store/slices/userActionsSlice';
import { userApi } from '../services/api';
import {
  BriefcaseIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  SparklesIcon,
  BookmarkIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Footer from '../components/common/Footer';
import JobDetailModal from '../components/dashboard/JobDetailModal';
import JobCard from '../components/common/JobCard';

export default function Jobs() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const aiSuggestions = []; // For demo
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({ name: '', email: '', resume: '', coverLetter: '' });
  const [isApplying, setIsApplying] = useState(false);


  useEffect(() => {
    if (user?.appliedJobs) {
      setAppliedJobs(user.appliedJobs);
    }
    if (user?.savedJobs) {
      setSavedJobs(user.savedJobs);
    }
  }, [user]);

  // Deep Link Support: Handle /jobs?id=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jobId = params.get('id');
    if (jobId && jobs.length > 0) {
      const job = jobs.find(j => (j._id || j.id) === jobId);
      if (job) {
        setSelectedJob(job);
      }
    }
  }, [jobs]);

  const fetchJobs = useCallback(async (page = 1, isLoadMore = false) => {
    try {
      if (!isLoadMore) setLoading(true);
      else setLoadingMore(true);

      const res = await userApi.getJobs({
        title: searchTerm,
        location: selectedLocation !== 'all' ? selectedLocation : '',
        type: selectedType !== 'all' ? selectedType : '',
        page: page,
        limit: 10
      });

      const data = res.data;
      const newJobs = data.jobs || (Array.isArray(data) ? data : []);

      if (isLoadMore) {
        setJobs(prev => [...prev, ...newJobs]);
      } else {
        setJobs(newJobs);
      }

      setHasMore(newJobs.length === 10);
      setCurrentPage(page);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchTerm, selectedLocation, selectedType]);

  useEffect(() => {
    fetchJobs(1, false);
  }, [fetchJobs]);

  const loadMore = () => {
    fetchJobs(currentPage + 1, true);
  };

  // Client-side filtering is no longer efficient with pagination
  // moving filtering entirely to backend (already handled in fetchJobs params)
  // But we might want to keep some instant feedback if possible, 
  // currently `filteredJobs` is just `jobs` since we trust backend filter for main queries.
  // Add client-side search only if you want to search within *fetched* results, 
  // but better to rely on backend for consistency.
  const displayJobs = jobs;

  // getTypeColor removed (replaced by common component)

  const saveJob = async (job) => {
    if (!savedJobs.find(j => (j._id || j.id) === (job._id || job.id))) {
      try {
        await userApi.toggleSaveJob(job._id || job.id);
        setSavedJobs([...savedJobs, job]);
        dispatch(addSavedJob(job));
      } catch (err) {
        console.error("Save job failed:", err);
      }
    }
  };

  const openApplyModal = (job) => {
    if (!appliedJobs.find(j => (j._id || j.id) === (job._id || job.id))) {
      setSelectedJob(job);
      setApplyForm({
        name: user?.name || '',
        email: user?.email || '',
        resume: user?.profile?.resume || '',
        coverLetter: ''
      });
      setShowApplyModal(true);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setIsApplying(true);
    try {
      await userApi.applyJob(selectedJob._id || selectedJob.id, {
        resumeUrl: applyForm.resume,
        coverLetter: applyForm.coverLetter
      });
      setAppliedJobs([...appliedJobs, selectedJob]);
      dispatch(addAppliedJob(selectedJob));
      setShowApplyModal(false);
      alert(`Application submitted successfully for ${selectedJob.title}!`);
    } catch (err) {
      console.error("Apply job failed:", err);
      alert("Failed to apply. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  const viewJobDetails = (job) => {
    setSelectedJob(job);
    // Increment view count
    userApi.incrementJobView(job._id || job.id).catch(console.error);
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-3 font-display">
            Job Opportunities
          </h1>
          <p className="text-slate-700 dark:text-slate-400 text-lg">
            Find your next role at top technology companies.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search jobs, companies, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-black dark:text-white placeholder-slate-500"
              />
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <FunnelIcon className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="pl-11 pr-8 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none appearance-none cursor-pointer text-black dark:text-white font-medium"
                >
                  <option value="all">All Types</option>
                  <option value="full-time">Full Time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
              <div className="relative">
                <MapPinIcon className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="pl-11 pr-8 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none appearance-none cursor-pointer text-black dark:text-white font-medium"
                >
                  <option value="all">All Locations</option>
                  <option value="bangalore">Bangalore</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="delhi">Delhi</option>
                  <option value="remote">Remote</option>
                </select>
              </div>

            </div>
          </div>
        </div>

        {/* AI Suggestions Modal */}
        {showAISuggestions && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl animate-scale-in">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <SparklesIcon className="w-6 h-6 text-primary-600" />
                    AI Recommendations
                  </h2>
                  <button onClick={() => setShowAISuggestions(false)}>
                    <XMarkIcon className="w-6 h-6 text-slate-400 hover:text-slate-600" />
                  </button>
                </div>

                <div className="space-y-4">
                  {aiSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white">{suggestion.title}</h3>
                          <p className="text-slate-600 dark:text-slate-400 text-sm">{suggestion.company}</p>
                        </div>
                        <span className="px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold ring-1 ring-inset ring-green-600/20">
                          {suggestion.match}% Match
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mb-3">{suggestion.reason}</p>
                      <button className="text-sm font-semibold text-primary-600 hover:text-primary-700">View Detailed Analysis &rarr;</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Jobs List */}
        <div className="space-y-4">
          {displayJobs.length > 0 ? (
            <>
              {displayJobs.map((job) => (
                <JobCard
                  key={job._id || job.id}
                  job={job}
                  onClick={() => viewJobDetails(job)}
                  onSave={() => saveJob(job)}
                  onApply={() => openApplyModal(job)}
                  isSaved={savedJobs.some(j => (j._id || j.id) === (job._id || job.id))}
                  isApplied={appliedJobs.some(j => (j._id || j.id) === (job._id || job.id))}
                  variant="card"
                />
              ))}

              {hasMore && (
                <div className="flex justify-center pt-8">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                  >
                    {loadingMore ? 'Loading...' : 'Load More Jobs'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              <BriefcaseIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No jobs found</h3>
              <p className="text-slate-500">Try adjusting your filters.</p>
            </div>
          )}
        </div>
        {/* Job Details Modal */}
        <JobDetailModal
          job={selectedJob}
          onClose={() => {
            setSelectedJob(null);
            // Clean up URL
            const url = new URL(window.location);
            url.searchParams.delete('id');
            window.history.pushState({}, '', url);
          }}
          onApply={() => {
            setSelectedJob(null);
            openApplyModal(selectedJob);
          }}
          onSave={() => saveJob(selectedJob)}
          isApplied={appliedJobs.some(j => (j._id || j.id) === (selectedJob?._id || selectedJob?.id))}
          isSaved={savedJobs.some(j => (j._id || j.id) === (selectedJob?._id || selectedJob?.id))}
        />

        {/* Quick Apply Modal */}
        {showApplyModal && selectedJob && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Quick Apply</h3>
                    <p className="text-sm text-slate-500">Applying to <span className="font-bold text-primary-600">{selectedJob.title}</span></p>
                  </div>
                  <button onClick={() => setShowApplyModal(false)}>
                    <XMarkIcon className="w-6 h-6 text-slate-400 hover:text-slate-600" />
                  </button>
                </div>

                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={applyForm.name}
                      onChange={e => setApplyForm({ ...applyForm, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={applyForm.email}
                      onChange={e => setApplyForm({ ...applyForm, email: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Resume Link (Portfolio/Drive)</label>
                    <input
                      type="url"
                      value={applyForm.resume}
                      onChange={e => setApplyForm({ ...applyForm, resume: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Cover Letter (Optional)</label>
                    <textarea
                      value={applyForm.coverLetter}
                      onChange={e => setApplyForm({ ...applyForm, coverLetter: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none h-24 resize-none"
                      placeholder="Why are you a good fit?"
                    />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowApplyModal(false)}
                      className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isApplying}
                      className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all flex justify-center items-center gap-2"
                    >
                      {isApplying ? 'Sending...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
