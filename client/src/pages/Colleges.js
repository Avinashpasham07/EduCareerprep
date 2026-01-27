import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Section } from '../components/common';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { userApi } from '../services/api';
import {
  BuildingLibraryIcon,
  MapPinIcon,
  AcademicCapIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  StarIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../store/slices/authSlice';
import CollegeProfileEditor from '../components/dashboard/CollegeProfileEditor';
import CollegeCard from '../components/common/CollegeCard';

export default function Colleges() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editTarget, setEditTarget] = useState(null); // null, 'new', or college object

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const res = await userApi.getColleges();
      setColleges(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredColleges = colleges.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const managedColleges = user?.role === 'counselor' ? [
    ...(user.profile?.collegeProfile ? [{
      id: user._id,
      name: user.name,
      location: user.profile?.location,
      ...user.profile.collegeProfile,
      isPrimary: true
    }] : []),
    ...(user.profile?.managedColleges || [])
  ] : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Counselor Management Section */}
        {user?.role === 'counselor' && (
          <div className="mb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Your Managed Institutions</h2>
                <p className="text-sm text-slate-500 font-medium">You can manage up to 10 college profiles ({managedColleges.length}/10)</p>
              </div>
              <button
                onClick={() => {
                  if (managedColleges.length >= 10) {
                    alert("Maximum 10 colleges allowed.");
                    return;
                  }
                  setEditTarget('new');
                }}
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl"
              >
                <PlusIcon className="w-5 h-5" />
                Add New Institution
              </button>
            </div>

            {managedColleges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {managedColleges.map((college, idx) => (
                  <div key={college._id || college.id || idx} className="relative group">
                    <CollegeCard
                      college={college}
                      onClick={() => navigate(`/colleges/${college._id || college.id}`)}
                    />
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditTarget(college);
                        }}
                        className="p-2 bg-white/90 dark:bg-slate-800/90 text-emerald-600 rounded-lg shadow-lg hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 dark:border-emerald-900"
                        title="Edit Profile"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (window.confirm("Are you sure you want to delete this college profile?")) {
                            try {
                              const res = await userApi.deleteManagedCollege(college._id || college.id);
                              dispatch(updateUser(res.data));
                              fetchColleges();
                              alert("Profile deleted successfully.");
                            } catch (err) {
                              alert("Failed to delete profile.");
                            }
                          }
                        }}
                        className="p-2 bg-white/90 dark:bg-slate-800/90 text-red-600 rounded-lg shadow-lg hover:bg-red-600 hover:text-white transition-all border border-red-100 dark:border-red-900"
                        title="Delete Profile"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <BuildingLibraryIcon className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Institutional Details Found</h3>
                <p className="text-slate-500 max-w-sm mb-6">Start by setting up your institution's profile to attract more students and partners.</p>
                <button
                  onClick={() => setEditTarget('new')}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                >
                  Create Profile Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* Edit Modal */}
        {editTarget && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-50 dark:bg-slate-950 w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setEditTarget(null)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors z-10"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              <div className="p-8 md:p-12">
                <CollegeProfileEditor
                  college={editTarget === 'new' ? null : editTarget}
                  onCancel={() => { setEditTarget(null); fetchColleges(); }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Directory Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight font-display">
            Explore <span className="text-emerald-600">Top Institutes</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto font-medium">
            Connect with the best academic institutions for your career growth.
          </p>

          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by name, course or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl border-none bg-white dark:bg-slate-900 shadow-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-900 dark:text-white font-medium"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent shadow-lg shadow-emerald-500/20"></div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Cataloging institutions...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredColleges.map((college) => (
              <CollegeCard
                key={college.id}
                college={college}
                onClick={() => navigate(`/colleges/${college.id}`)}
                variant="card"
              />
            ))}

            {filteredColleges.length === 0 && (
              <div className="col-span-full text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BuildingLibraryIcon className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No institutions found</h3>
                <p className="text-slate-500">We couldn't find any results matching your search terms.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// CollegeCard inline component removed (replaced by common component)
