import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Section, Button } from '../components/common';
import { userApi } from '../services/api';
import { addSavedCollege, removeSavedCollege } from '../store/slices/userActionsSlice';
import {
    AcademicCapIcon,
    MapPinIcon,
    GlobeAltIcon,
    BookmarkIcon,
    BuildingLibraryIcon,
    PhoneIcon,
    EnvelopeIcon,
    CalendarIcon,
    BookOpenIcon,
    InformationCircleIcon,
    PhotoIcon,
    VideoCameraIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid, StarIcon } from '@heroicons/react/24/solid';

export default function CollegeDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { savedColleges } = useSelector((state) => state.userActions);

    const [college, setCollege] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Overview');
    const [isSaved, setIsSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCollegeDetails();
    }, [id]);

    useEffect(() => {
        if (savedColleges.some(c => (c.id || c._id) === id)) {
            setIsSaved(true);
        }
    }, [savedColleges, id]);

    const fetchCollegeDetails = async () => {
        try {
            const res = await userApi.getCollegeById(id);
            setCollege(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch college details:', error);
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!college) return;
        setSaving(true);
        try {
            await userApi.toggleSaveCollege(id);

            if (isSaved) {
                dispatch(removeSavedCollege(id));
                setIsSaved(false);
            } else {
                dispatch(addSavedCollege(college));
                setIsSaved(true);
            }
        } catch (error) {
            console.error('Failed to save college:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!college) {
        return (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-950 min-h-screen pt-32">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">College not found</h2>
                <Button variant="ghost" onClick={() => navigate('/colleges')}>Back to Directory</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 pt-24">
            {/* Hero Section */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 mb-8 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                        <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-md overflow-hidden">
                            {college.logo ? (
                                <img src={college.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                            ) : (
                                <BuildingLibraryIcon className="w-12 h-12 text-green-700 dark:text-slate-400" />
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h1 className="text-3xl font-bold text-black dark:text-white font-display">{college.name}</h1>
                                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/30">
                                    <StarIcon className="w-3.5 h-3.5 text-amber-500" />
                                    <span className="text-xs font-bold text-amber-700 dark:text-amber-500">4.5</span>
                                </div>
                            </div>
                            <p className="text-lg text-slate-600 dark:text-slate-400 flex items-center gap-2 font-medium">
                                <MapPinIcon className="w-5 h-5 text-slate-400" />
                                {college.location || 'Location not verified'}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm ${isSaved
                                    ? 'bg-primary-50 text-primary-700 border border-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800'
                                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
                                    }`}
                            >
                                {isSaved ? <BookmarkIconSolid className="w-5 h-5" /> : <BookmarkIcon className="w-5 h-5" />}
                                {isSaved ? "Saved" : "Save"}
                            </button>
                            {college.website && (
                                <button
                                    onClick={() => window.open(college.website, '_blank')}
                                    className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all"
                                >
                                    <GlobeAltIcon className="w-5 h-5" />
                                    Website
                                </button>
                            )}
                            {college.mapsLink && (
                                <button
                                    onClick={() => window.open(college.mapsLink, '_blank')}
                                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 shadow-lg transition-all"
                                >
                                    <MapPinIcon className="w-5 h-5" />
                                    Location
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Custom Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 space-x-8">
                    {['Overview', 'Courses', 'Contact'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-sm font-bold flex items-center gap-2 transition-all relative ${activeTab === tab
                                ? 'text-primary-600 dark:text-primary-400'
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                                }`}
                        >
                            {tab === 'Overview' && <InformationCircleIcon className="w-5 h-5" />}
                            {tab === 'Courses' && <BookOpenIcon className="w-5 h-5" />}
                            {tab === 'Contact' && <PhoneIcon className="w-5 h-5" />}
                            {tab}
                            {activeTab === tab && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 dark:bg-primary-400 rounded-t-full"></span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="animate-fade-in-up">
                    {activeTab === 'Overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                                    <h3 className="text-xl font-bold text-black dark:text-white mb-4 font-display flex items-center gap-2">
                                        <InformationCircleIcon className="w-5 h-5 text-primary-500" />
                                        About the Institute
                                    </h3>
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                                        {college.description || "The institute has not provided a description yet."}
                                    </p>
                                </div>

                                {/* Campus Gallery */}
                                {college.campusPhotos && college.campusPhotos.length > 0 && (
                                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <h3 className="text-xl font-bold text-black dark:text-white mb-6 font-display flex items-center gap-2">
                                            <PhotoIcon className="w-5 h-5 text-primary-500" />
                                            Campus Photos
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {college.campusPhotos.map((photo, i) => (
                                                <div key={i} className="aspect-video rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:scale-[1.02] transition-transform duration-300 cursor-zoom-in">
                                                    <img src={photo} alt={`Campus ${i + 1}`} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Video Tour */}
                                {college.videoLink && (
                                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <h3 className="text-xl font-bold text-black dark:text-white mb-6 font-display flex items-center gap-2">
                                            <VideoCameraIcon className="w-5 h-5 text-primary-500" />
                                            Virtual Video Tour
                                        </h3>
                                        <div className="aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-2xl">
                                            {college.videoLink.includes('youtube.com') || college.videoLink.includes('youtu.be') ? (
                                                <iframe
                                                    className="w-full h-full"
                                                    src={`https://www.youtube.com/embed/${college.videoLink.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|v\/|embed\/|user\/(?:\w+)\/))([\w-]{11})/)?.[1]}`}
                                                    title="YouTube video player"
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                                                    <VideoCameraIcon className="w-16 h-16 text-slate-700 mb-4" />
                                                    <a href={college.videoLink} target="_blank" rel="noopener noreferrer" className="text-primary-500 font-bold hover:underline">
                                                        Click here to watch the tour
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <h3 className="text-xl font-bold text-black dark:text-white mb-6 font-display flex items-center gap-2">
                                        <StarIcon className="w-5 h-5 text-primary-500" />
                                        Key Highlights
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { k: 'Email', v: college.email, i: <EnvelopeIcon className="w-6 h-6" /> },
                                            { k: 'Established', v: college.established || 'N/A', i: <BuildingLibraryIcon className="w-6 h-6" /> },
                                            { k: 'Phone', v: college.phone || 'N/A', i: <PhoneIcon className="w-6 h-6" /> },
                                        ].map((item, i) => (
                                            <div key={i} className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 group hover:border-primary-500/30 transition-colors">
                                                <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 mb-3 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform">
                                                    {item.i}
                                                </div>
                                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{item.k}</div>
                                                <div className="font-bold text-slate-900 dark:text-white truncate" title={item.v}>{item.v}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Courses' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {college.courses && college.courses.length > 0 ? (
                                college.courses.map((course, i) => (
                                    <div key={i} className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary-500/50 dark:hover:border-primary-500/50 shadow-sm hover:shadow-lg transition-all">
                                        <div className="w-12 h-12 bg-green-50 dark:bg-primary-900/10 rounded-xl flex items-center justify-center text-green-700 dark:text-primary-400 mb-4 border border-green-500 dark:border-transparent group-hover:scale-110 transition-transform">
                                            <AcademicCapIcon className="w-6 h-6" />
                                        </div>
                                        <h4 className="text-lg font-bold text-black dark:text-white mb-2">{course}</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-4">Undergraduate Program</p>
                                        <button className="text-sm font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1 hover:gap-2 transition-all">
                                            View Syllabus <span aria-hidden="true">&rarr;</span>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-slate-700">
                                        <BookOpenIcon className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-black dark:text-white">No courses listed</h3>
                                    <p className="text-slate-500">This college hasn't added any courses yet.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'Contact' && (
                        <div className="max-w-2xl bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-xl font-bold text-black dark:text-white mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">Contact Information</h3>
                            <div className="space-y-8">
                                <div className="flex items-start gap-6 group">
                                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-200 dark:border-blue-900/50 group-hover:scale-110 transition-transform">
                                        <EnvelopeIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Email Address</label>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white">{college.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-6 group">
                                    <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center flex-shrink-0 border border-green-200 dark:border-green-900/50 group-hover:scale-110 transition-transform">
                                        <PhoneIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Phone Number</label>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white">{college.phone || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-6 group">
                                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center flex-shrink-0 border border-purple-200 dark:border-purple-900/50 group-hover:scale-110 transition-transform">
                                        <MapPinIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Address</label>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white">{college.location}</p>
                                        {college.mapsLink && (
                                            <a href={college.mapsLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 hover:text-primary-700 mt-2 transition-colors">
                                                Get Directions <MapPinIcon className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
