import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card, Section } from '../common';
import { userApi } from '../../services/api';
import { updateUser } from '../../store/slices/authSlice';
import { PhotoIcon, XMarkIcon, PlusIcon, LinkIcon, VideoCameraIcon, MapPinIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';

export default function CollegeProfileEditor({ onCancel, college }) {
    const { user } = useSelector((s) => s.auth);
    const dispatch = useDispatch();
    const profile = college || (user?.profile?.collegeProfile) || {};

    const [logo, setLogo] = useState(profile.logo || null);
    const [campusPhotos, setCampusPhotos] = useState(profile.campusPhotos || []);
    const [uploading, setUploading] = useState(false);

    // URL input states
    const [logoUrl, setLogoUrl] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            name: college?.name || (college ? '' : user?.name) || '',
            location: college?.location || (college ? '' : user?.profile?.location) || '',
            description: profile.description || '',
            website: profile.website || '',
            established: profile.established || '',
            phone: profile.phone || '',
            courses: profile.courses?.join(', ') || '',
            videoLink: profile.videoLink || '',
            mapsLink: profile.mapsLink || ''
        }
    });

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === 'logo') {
                setLogo(reader.result);
            } else {
                setCampusPhotos(prev => [...prev, reader.result]);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleAddPhotoUrl = () => {
        if (!photoUrl) return;
        setCampusPhotos(prev => [...prev, photoUrl]);
        setPhotoUrl('');
    };

    const handleSetLogoUrl = () => {
        if (!logoUrl) return;
        setLogo(logoUrl);
        setLogoUrl('');
    };

    const removePhoto = (index) => {
        setCampusPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data) => {
        setUploading(true);
        try {
            const payload = {
                name: data.name,
                location: data.location,
                description: data.description,
                website: data.website,
                established: data.established,
                phone: data.phone,
                courses: data.courses.split(',').map(c => c.trim()).filter(Boolean),
                logo,
                campusPhotos,
                videoLink: data.videoLink,
                mapsLink: data.mapsLink
            };

            let res;
            if (college && (college._id || college.id)) {
                res = await userApi.updateManagedCollege(college._id || college.id, payload);
            } else if (!college && user?.role === 'counselor') {
                // Special case: update the counselor's own primary college profile
                res = await userApi.updateManagedCollege(user._id, payload);
            } else {
                res = await userApi.addManagedCollege(payload);
            }

            dispatch(updateUser(res.data));
            alert('Profile updated successfully!');
            if (onCancel) onCancel();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setUploading(false);
        }
    };

    const formStyles = {
        input: "w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm",
        label: "block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2",
        textarea: "w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder:text-slate-400 min-h-[120px] resize-y text-sm",
        sectionTitle: "text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2"
    };

    return (
        <div className="animate-fade-in max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Manage Institute Profile</h2>
                    <p className="text-slate-500 dark:text-slate-400">Control your public presence and media</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-8 shadow-xl border-0 bg-white dark:bg-slate-900">
                        <h3 className={formStyles.sectionTitle}>
                            <PhotoIcon className="w-5 h-5 text-primary-500" />
                            Basic Information
                        </h3>
                        <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={formStyles.label}>Institute Name</label>
                                    <input className={formStyles.input} {...register('name')} />
                                </div>
                                <div>
                                    <label className={formStyles.label}>Location (City, State)</label>
                                    <input className={formStyles.input} {...register('location')} />
                                </div>
                            </div>

                            <div>
                                <label className={formStyles.label}>About Institute</label>
                                <textarea className={formStyles.textarea} {...register('description')} placeholder="Tell students about your vision, history and achievements..." />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={formStyles.label}>Website URL</label>
                                    <input className={formStyles.input} {...register('website')} placeholder="https://www.institute.edu" />
                                </div>
                                <div>
                                    <label className={formStyles.label}>Established Year</label>
                                    <input className={formStyles.input} {...register('established')} placeholder="e.g. 1995" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={formStyles.label}>Contact Phone</label>
                                    <input className={formStyles.input} {...register('phone')} placeholder="+91 9876543210" />
                                </div>
                                <div>
                                    <label className={formStyles.label}>Courses Offered</label>
                                    <input className={formStyles.input} {...register('courses')} placeholder="B.Tech, MBA, MCA (Comma separated)" />
                                </div>
                            </div>

                            <h3 className={`${formStyles.sectionTitle} mt-10`}>
                                <LinkIcon className="w-5 h-5 text-primary-500" />
                                External Media & Map
                            </h3>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className={formStyles.label}>Video Tour Link (YouTube/Vimeo)</label>
                                    <div className="relative">
                                        <VideoCameraIcon className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                        <input className={`${formStyles.input} pl-12`} {...register('videoLink')} placeholder="https://youtube.com/watch?v=..." />
                                    </div>
                                </div>
                                <div>
                                    <label className={formStyles.label}>Google Maps Location Link</label>
                                    <div className="relative">
                                        <MapPinIcon className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                        <input className={`${formStyles.input} pl-12`} {...register('mapsLink')} placeholder="https://goo.gl/maps/..." />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Card>

                    <div className="flex justify-end pt-4 gap-4">
                        {onCancel && (
                            <Button size="lg" variant="outline" onClick={onCancel} className="px-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                                Cancel
                            </Button>
                        )}
                        <Button size="lg" onClick={handleSubmit(onSubmit)} loading={isSubmitting || uploading} className="px-10 shadow-lg shadow-primary-500/20 font-bold">
                            Save Profile
                        </Button>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="p-6 shadow-lg border-0 bg-white dark:bg-slate-900">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Institution Logo</h3>
                        <div
                            onClick={() => document.getElementById('logo-upload').click()}
                            className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group relative overflow-hidden h-40 mb-4"
                        >
                            {logo ? (
                                <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                            ) : (
                                <>
                                    <BuildingLibraryIcon className="w-12 h-12 text-slate-400 mb-2 group-hover:scale-110 transition-transform" />
                                    <p className="text-xs font-bold text-slate-500">Upload Logo File</p>
                                </>
                            )}
                            <input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Or Paste Logo URL</label>
                            <div className="flex gap-2">
                                <input
                                    className={formStyles.input}
                                    placeholder="https://..."
                                    value={logoUrl}
                                    onChange={(e) => setLogoUrl(e.target.value)}
                                />
                                <button onClick={handleSetLogoUrl} className="px-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-primary-500 hover:text-white transition-all">
                                    <PlusIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 shadow-lg border-0 bg-white dark:bg-slate-900">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Campus Photos (Max 6)</h3>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {campusPhotos.map((photo, i) => (
                                <div key={i} className="aspect-video rounded-lg bg-slate-100 dark:bg-slate-800 relative group overflow-hidden border border-slate-200 dark:border-slate-800">
                                    <img src={photo} alt="Campus" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => removePhoto(i)}
                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    >
                                        <XMarkIcon className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            {campusPhotos.length < 6 && (
                                <button
                                    onClick={() => document.getElementById('photo-upload').click()}
                                    className="aspect-video rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-slate-400"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                    <span className="text-[10px] font-bold uppercase mt-1">Upload</span>
                                </button>
                            )}
                        </div>
                        <input id="photo-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'photo')} />

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Add Photo by URL</label>
                            <div className="flex gap-2">
                                <input
                                    className={formStyles.input}
                                    placeholder="https://..."
                                    value={photoUrl}
                                    onChange={(e) => setPhotoUrl(e.target.value)}
                                    disabled={campusPhotos.length >= 6}
                                />
                                <button
                                    onClick={handleAddPhotoUrl}
                                    disabled={campusPhotos.length >= 6}
                                    className="px-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-primary-500 hover:text-white transition-all disabled:opacity-50"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
