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
    VideoCameraIcon,
    UserCircleIcon,
    ChatBubbleOvalLeftEllipsisIcon
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

    // Review Form State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

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

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        console.log('[DEBUG] handleSubmitReview triggered');
        if (!user) {
            console.log('[DEBUG] No user found, navigating to login');
            navigate('/login');
            return;
        }
        if (!comment.trim()) {
            console.log('[DEBUG] Empty comment, aborting');
            return;
        }

        console.log('[DEBUG] Submitting review:', { rating, comment, collegeId: id });
        setSubmittingReview(true);
        try {
            const response = await userApi.addReview(id, { rating, comment });
            console.log('[DEBUG] addReview success:', response.data);
            setComment('');
            setRating(5);
            // Re-fetch to show new review and updated rating
            console.log('[DEBUG] Refetching college details...');
            fetchCollegeDetails();
        } catch (error) {
            console.error('[DEBUG] addReview error:', error);
            console.error('[DEBUG] Error details:', error.response?.data || error.message);
        } finally {
            console.log('[DEBUG] Setting submittingReview to false');
            setSubmittingReview(false);
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
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 mb-8 shadow-sm relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 -mr-32 -mt-32 rounded-full blur-3xl invisible md:visible"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 -ml-24 -mb-24 rounded-full blur-3xl invisible md:visible"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
                        {/* Logo Container - Styled like a Polaroid/Card */}
                        <div className="w-28 h-28 md:w-32 md:h-32 bg-white dark:bg-slate-800 rounded-2xl md:rounded-3xl flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden shrink-0 rotate-1 md:rotate-0 hover:rotate-0 transition-transform duration-500">
                            {college.logo ? (
                                <img src={college.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                            ) : (
                                <BuildingLibraryIcon className="w-14 h-14 text-emerald-600 dark:text-emerald-500" />
                            )}
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row items-center gap-3 mb-3">
                                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                                    {college.name}
                                </h1>
                                <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-xl border border-amber-100 dark:border-amber-800/30">
                                    <StarIcon className="w-4 h-4 text-amber-500" />
                                    <span className="text-sm font-black text-amber-700 dark:text-amber-400">{college.avgRating > 0 ? college.avgRating.toFixed(1) : 'New'}</span>
                                    {college.reviewCount > 0 && <span className="text-xs text-slate-400 font-bold ml-0.5">({college.reviewCount})</span>}
                                </div>
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 dark:text-slate-400 font-bold mb-8 md:mb-0">
                                <MapPinIcon className="w-5 h-5 text-emerald-500" />
                                <span className="text-base md:text-lg">{college.location || 'Location Not Verified'}</span>
                            </div>
                        </div>

                        <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 md:gap-4 mt-4 md:mt-2">
                            <div className="grid grid-cols-2 lg:flex gap-3 w-full">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className={`flex items-center justify-center gap-2 px-6 py-3.5 md:py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-sm flex-1 ${isSaved
                                        ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-500 dark:bg-emerald-900/20 dark:text-emerald-400'
                                        : 'bg-white text-slate-700 border-2 border-slate-100 hover:border-emerald-500 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
                                        }`}
                                >
                                    {isSaved ? <BookmarkIconSolid className="w-5 h-5" /> : <BookmarkIcon className="w-5 h-5 text-slate-400" />}
                                    {isSaved ? "Saved" : "Save"}
                                </button>
                                {college.website && (
                                    <button
                                        onClick={() => window.open(college.website, '_blank')}
                                        className="flex items-center justify-center gap-2 px-6 py-3.5 md:py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-black text-sm uppercase tracking-widest hover:border-emerald-500 shadow-sm transition-all flex-1"
                                    >
                                        <GlobeAltIcon className="w-5 h-5 text-slate-400" />
                                        Website
                                    </button>
                                )}
                            </div>
                            {college.mapsLink && (
                                <button
                                    onClick={() => window.open(college.mapsLink, '_blank')}
                                    className="flex items-center justify-center gap-2 px-6 py-4 md:py-3.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-900/10 transition-all w-full"
                                >
                                    <MapPinIcon className="w-5 h-5" />
                                    View Location
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Custom Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 space-x-6 overflow-x-auto no-scrollbar scroll-smooth">
                    {['Overview', 'Courses', 'Contact', 'Reviews'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-xs md:text-sm font-black uppercase tracking-widest flex items-center gap-2 transition-all relative shrink-0 ${activeTab === tab
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                                }`}
                        >
                            {tab === 'Overview' && <InformationCircleIcon className="w-4 h-4 md:w-5 md:h-5" />}
                            {tab === 'Courses' && <BookOpenIcon className="w-4 h-4 md:w-5 md:h-5" />}
                            {tab === 'Contact' && <PhoneIcon className="w-4 h-4 md:w-5 md:h-5" />}
                            {tab === 'Reviews' && <StarIcon className="w-4 h-4 md:w-5 md:h-5" />}
                            {tab}
                            {activeTab === tab && (
                                <span className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 dark:bg-emerald-400 rounded-full shadow-[0_-4px_10px_rgba(16,185,129,0.3)]"></span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="animate-fade-in-up">
                    {activeTab === 'Overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                                    <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-6 font-display flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600">
                                            <InformationCircleIcon className="w-6 h-6" />
                                        </div>
                                        About the Institute
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base md:text-lg font-medium">
                                        {college.description || "The institute has not provided a description yet."}
                                    </p>
                                </div>

                                {/* Campus Gallery */}
                                {college.campusPhotos && college.campusPhotos.length > 0 && (
                                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-8 font-display flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600">
                                                <PhotoIcon className="w-6 h-6" />
                                            </div>
                                            Campus Gallery
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {college.campusPhotos.map((photo, i) => (
                                                <div key={i} className="aspect-square md:aspect-video rounded-2xl overflow-hidden border-2 border-slate-50 dark:border-slate-800 shadow-sm hover:scale-[1.05] transition-transform duration-500 cursor-zoom-in">
                                                    <img src={photo} alt={`Campus ${i + 1}`} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Video Tour */}
                                {college.videoLink && (
                                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-8 font-display flex items-center gap-3">
                                            <div className="w-10 h-10 bg-red-50 dark:bg-red-500/10 rounded-xl flex items-center justify-center text-red-600">
                                                <VideoCameraIcon className="w-6 h-6" />
                                            </div>
                                            Virtual Tour
                                        </h3>
                                        <div className="aspect-video rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border-4 border-white dark:border-slate-800">
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
                                                    <a href={college.videoLink} target="_blank" rel="noopener noreferrer" className="text-emerald-500 font-black hover:underline">
                                                        WATCH THE TOUR &rarr;
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-8 font-display flex items-center gap-3">
                                        <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600">
                                            <StarIcon className="w-6 h-6" />
                                        </div>
                                        Key Highlights
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        {[
                                            { k: 'Email', v: college.email, i: <EnvelopeIcon className="w-6 h-6" />, c: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
                                            { k: 'Founded', v: college.established || 'N/A', i: <BuildingLibraryIcon className="w-6 h-6" />, c: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
                                            { k: 'Support', v: college.phone || 'N/A', i: <PhoneIcon className="w-6 h-6" />, c: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-500/10' },
                                        ].map((item, i) => (
                                            <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 group hover:border-emerald-500/30 transition-all">
                                                <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center ${item.c} mb-4 shadow-inner group-hover:scale-110 transition-transform`}>
                                                    {item.i}
                                                </div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.k}</div>
                                                <div className="font-bold text-slate-900 dark:text-white truncate lg:text-lg" title={item.v}>{item.v}</div>
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

                    {activeTab === 'Reviews' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Review Stats */}
                            <div className="lg:col-span-1 space-y-6">
                                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                                    <h3 className="text-lg font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Average Rating</h3>
                                    <div className="text-6xl font-black text-slate-900 dark:text-white mb-4">{college.avgRating || '0.0'}</div>
                                    <div className="flex justify-center gap-1 mb-4">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <StarIcon key={i} className={`w-6 h-6 ${i <= Math.round(college.avgRating || 0) ? 'text-amber-500' : 'text-slate-200 dark:text-slate-700'}`} />
                                        ))}
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium">Based on {college.reviewCount || 0} student reviews</p>
                                </div>

                                {/* Add Review Form */}
                                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <h3 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-2">
                                        <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6 text-primary-500" />
                                        Write a Review
                                    </h3>
                                    <form onSubmit={handleSubmitReview} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-500 mb-2">Rating</label>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() => setRating(i)}
                                                        className={`p-1 transition-transform hover:scale-125 ${i <= rating ? 'text-amber-500' : 'text-slate-200 dark:text-slate-700'}`}
                                                    >
                                                        <StarIcon className="w-8 h-8" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-500 mb-2">Comment</label>
                                            <textarea
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="Share your experience with this college..."
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none min-h-[120px] transition-all"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={submittingReview}
                                            className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 disabled:opacity-50 transition-all shadow-lg"
                                        >
                                            {submittingReview ? 'Posting...' : 'Submit Review'}
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Reviews List */}
                            <div className="lg:col-span-2 space-y-6">
                                {college.reviews && college.reviews.length > 0 ? (
                                    college.reviews.map((rev, i) => (
                                        <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                                                        <UserCircleIcon className="w-10 h-10" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 dark:text-white">{rev.userName}</h4>
                                                        <p className="text-xs text-slate-500 font-medium">{new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <StarIcon key={star} className={`w-4 h-4 ${star <= rev.rating ? 'text-amber-500' : 'text-slate-100 dark:text-slate-800'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                                                "{rev.comment}"
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <StarIcon className="w-10 h-10 text-slate-300" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">No reviews yet</h3>
                                        <p className="text-slate-500 max-w-sm mx-auto mt-2">Be the first student to share your journey at this institute!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
