import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card } from '../common';
import { userApi } from '../../services/api';
import { updateUser, fetchCurrentUser } from '../../store/slices/authSlice';
import { AcademicCapIcon, UserCircleIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

export default function StudentProfileEditor({ onCancel }) {
    const { user } = useSelector((s) => s.auth);
    // ... (rest of code)


    const dispatch = useDispatch();
    const profile = user?.profile || {};
    const [colleges, setColleges] = useState([]);

    useEffect(() => {
        const loadColleges = async () => {
            try {
                const res = await userApi.getColleges();
                setColleges(res.data);
            } catch (err) {
                console.error("Failed to load colleges", err);
            }
        };
        loadColleges();
    }, []);

    const { register, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            name: user?.name || '',
            location: profile.location || '',
            bio: profile.bio || '',
            skills: profile.skills?.join(', ') || '',
            education: profile.education || '',
            university: profile.university || '',
            collegeId: (profile.collegeId?._id || profile.collegeId) || '',
            graduationYear: profile.graduationYear || '',
            interests: profile.interests?.join(', ') || '',
            portfolioLink: profile.portfolioLink || '',
            avatar: profile.avatar || '',
            resumeLink: profile.resumeLink || ''
        }
    });

    const selectedCollegeId = watch('collegeId');

    useEffect(() => {
        if (selectedCollegeId) {
            const college = colleges.find(c => (c.id || c._id) === selectedCollegeId);
            if (college) {
                setValue('university', college.name);
            }
        }
    }, [selectedCollegeId, colleges, setValue]);

    const onSubmit = async (data) => {
        try {
            const payload = {
                name: data.name, // Top-level field
                profile: {
                    ...profile, // Keep existing profile data
                    bio: data.bio,
                    location: data.location, // Correctly inside profile
                    skills: typeof data.skills === 'string'
                        ? data.skills.split(',').map(s => s.trim()).filter(Boolean)
                        : data.skills,
                    education: data.education,
                    university: data.university,
                    collegeId: data.collegeId && data.collegeId !== '' ? data.collegeId : undefined,
                    graduationYear: data.graduationYear,
                    portfolioLink: data.portfolioLink,
                    avatar: data.avatar,
                    resumeLink: data.resumeLink,
                    interests: typeof data.interests === 'string'
                        ? data.interests.split(',').map(s => s.trim()).filter(Boolean)
                        : data.interests,
                }
            };

            const res = await userApi.updateProfile(payload);
            dispatch(updateUser(res.data));
            // Force fetch fresh data to ensure consistency
            dispatch(fetchCurrentUser());

            alert('Profile updated successfully! 🎓');
            if (onCancel) onCancel();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || 'Failed to update profile ❌';
            alert(msg);
        }
    };

    const formStyles = {
        input: "w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-400 font-medium",
        label: "block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide",
        textarea: "w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-400 min-h-[140px] resize-y font-medium",
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Student Profile</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">Update your skills and educational details</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-8 border-slate-200 dark:border-slate-800 shadow-xl">
                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                                <UserCircleIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Personal Details</h3>
                        </div>

                        <form id="student-profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={formStyles.label}>Full Name</label>
                                    <input className={formStyles.input} {...register('name')} placeholder="Your Name" />
                                </div>
                                <div>
                                    <label className={formStyles.label}>Location</label>
                                    <input className={formStyles.input} {...register('location')} placeholder="City, State" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className={formStyles.label}>Personal / Portfolio Link</label>
                                    <input className={formStyles.input} {...register('portfolioLink')} placeholder="https://yourportfolio.com or LinkedIn URL" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className={formStyles.label}>Avatar / Profile Photo Link</label>
                                    <input className={formStyles.input} {...register('avatar')} placeholder="https://example.com/your-photo.jpg" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className={formStyles.label}>Resume Link (Google Drive / DropBox)</label>
                                    <input className={formStyles.input} {...register('resumeLink')} placeholder="https://drive.google.com/..." />
                                    <p className="text-xs text-slate-500 mt-2 italic text-emerald-600">Please make sure the link is set to "Public" so recruiters can view it.</p>
                                </div>
                            </div>

                            <div>
                                <label className={formStyles.label}>Bio / Summary</label>
                                <textarea className={formStyles.textarea} {...register('bio')} placeholder="Tell recruiters about yourself..." />
                            </div>

                            <div>
                                <label className={formStyles.label}>Skills (Comma Separated)</label>
                                <input className={formStyles.input} {...register('skills')} placeholder="React, Node.js, Design, etc." />
                                <p className="text-xs text-slate-500 mt-2">These act as keywords for job matching.</p>
                            </div>

                            <div>
                                <label className={formStyles.label}>Interests (Comma Separated)</label>
                                <input className={formStyles.input} {...register('interests')} placeholder="AI, UI/UX, Web3, Photography, etc." />
                                <p className="text-xs text-slate-500 mt-2">Help us customize your career feed.</p>
                            </div>

                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                                        <AcademicCapIcon className="w-5 h-5" />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">Education</h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className={formStyles.label}>Select or Search Institute</label>
                                        <select className={formStyles.input} {...register('collegeId')}>
                                            <option value="">-- Choose From Platform Partners --</option>
                                            {colleges.map(c => (
                                                <option key={c.id || c._id} value={c.id || c._id}>{c.name} ({c.location || 'Remote'})</option>
                                            ))}
                                        </select>
                                        <div className="mt-4">
                                            <label className={formStyles.label}>Or Type Manually (If not in list)</label>
                                            <input className={formStyles.input} {...register('university')} placeholder="Your University Name" />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2 italic">Select your institute to see exclusive on-campus drives and placement news.</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className={formStyles.label}>Degree / Major</label>
                                        <input className={formStyles.input} {...register('education')} placeholder="B.Tech, B.Sc, etc." />
                                    </div>
                                    <div>
                                        <label className={formStyles.label}>Graduation Year</label>
                                        <input className={formStyles.input} {...register('graduationYear')} placeholder="e.g. 2025" />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Card>

                    <div className="flex justify-end pt-4 gap-4">
                        {onCancel && (
                            <Button size="lg" variant="outline" onClick={onCancel} className="px-8 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
                                Cancel
                            </Button>
                        )}
                        <Button size="lg" onClick={handleSubmit(onSubmit)} className="px-8 shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 text-white">
                            Save Changes
                        </Button>
                    </div>
                </div>

                {/* Right: Resume & Extras */}
                <div className="space-y-6">
                    <Card className="p-6 border-slate-200 dark:border-slate-800 shadow-lg">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Resume / CV</h3>
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all cursor-pointer group hover:border-emerald-400">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 text-slate-400 group-hover:text-emerald-500">
                                <BriefcaseIcon className="w-8 h-8" />
                            </div>
                            <p className="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-emerald-500 transition-colors">Upload Resume</p>
                            <p className="text-xs text-slate-400 mt-1">PDF, DOCX up to 5MB</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
