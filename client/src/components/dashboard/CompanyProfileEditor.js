import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card } from '../common';
import { userApi } from '../../services/api';
import { updateUser } from '../../store/slices/authSlice';
import {
    BuildingOfficeIcon,
    GlobeAltIcon,
    MapPinIcon,
    PlusIcon,
    PhotoIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export default function CompanyProfileEditor({ onCancel }) {
    const { user } = useSelector((s) => s.auth);
    const dispatch = useDispatch();
    const profile = user?.profile?.recruiterProfile || {};

    const [logo, setLogo] = useState(profile.logo || null);
    const [logoUrl, setLogoUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    const { register, handleSubmit, formState: { isSubmitting } } = useForm({
        defaultValues: {
            companyName: profile.companyName || user?.name || '',
            location: user?.profile?.location || '',
            description: profile.description || '',
            website: profile.website || '',
            size: profile.size || '1-50',
            industry: profile.industry || '',
            benefits: profile.benefits?.join(', ') || ''
        }
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setLogo(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSetLogoUrl = () => {
        if (!logoUrl) return;
        setLogo(logoUrl);
        setLogoUrl('');
    };

    const onSubmit = async (data) => {
        setUploading(true);
        try {
            const payload = {
                profile: {
                    ...user.profile,
                    location: data.location,
                    recruiterProfile: {
                        ...profile,
                        companyName: data.companyName,
                        industry: data.industry,
                        description: data.description,
                        website: data.website,
                        size: data.size,
                        benefits: data.benefits.split(',').map(b => b.trim()).filter(Boolean),
                        logo: logo
                    }
                }
            };

            const res = await userApi.updateProfile(payload);
            dispatch(updateUser(res.data));
            alert('Company profile updated successfully!');
            if (onCancel) onCancel();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setUploading(false);
        }
    };

    const formStyles = {
        input: "w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-400 font-medium text-sm",
        label: "block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2",
        textarea: "w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-400 min-h-[140px] resize-y font-medium text-sm",
        select: "w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200 text-slate-900 dark:text-white font-medium appearance-none cursor-pointer text-sm"
    };

    return (
        <div className="animate-fade-in max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Organization Profile</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your employer brand and company details</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                {/* Left: Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-8 border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900">
                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                                <BuildingOfficeIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Organization Details</h3>
                        </div>

                        <form id="company-profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={formStyles.label}>Company Name</label>
                                    <input className={formStyles.input} {...register('companyName')} placeholder="e.g. Acme Inc." />
                                </div>
                                <div className="relative">
                                    <label className={formStyles.label}>Headquarters</label>
                                    <div className="relative">
                                        <input className={`${formStyles.input} pl-11`} {...register('location')} placeholder="City, Country" />
                                        <MapPinIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className={formStyles.label}>About Company</label>
                                <textarea className={formStyles.textarea} {...register('description')} placeholder="Tell candidates about your mission, culture, and what makes you unique..." />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <label className={formStyles.label}>Website</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">https://</span>
                                        <input className={`${formStyles.input} pl-16`} {...register('website')} placeholder="www.example.com" />
                                    </div>
                                </div>
                                <div>
                                    <label className={formStyles.label}>Company Size</label>
                                    <div className="relative">
                                        <select className={formStyles.select} {...register('size')}>
                                            <option value="1-10">1-10 Employees</option>
                                            <option value="11-50">11-50 Employees</option>
                                            <option value="51-200">51-200 Employees</option>
                                            <option value="201-500">201-500 Employees</option>
                                            <option value="500+">500+ Employees</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={formStyles.label}>Industry</label>
                                    <input className={formStyles.input} {...register('industry')} placeholder="e.g. Fintech, EdTech" />
                                </div>
                                <div>
                                    <label className={formStyles.label}>Benefits (Comma separated)</label>
                                    <input className={formStyles.input} {...register('benefits')} placeholder="Remote work, Health insurance..." />
                                </div>
                            </div>
                        </form>
                    </Card>

                    <div className="flex justify-end pt-4 gap-4">
                        {onCancel && (
                            <Button size="lg" variant="outline" onClick={onCancel} className="px-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                                Cancel
                            </Button>
                        )}
                        <Button
                            size="lg"
                            onClick={handleSubmit(onSubmit)}
                            loading={isSubmitting || uploading}
                            className="px-10 shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        >
                            Save Profile
                        </Button>
                    </div>
                </div>

                {/* Right: Branding */}
                <div className="space-y-6">
                    <Card className="p-6 border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Company Logo</h3>
                        <div
                            onClick={() => document.getElementById('logo-upload').click()}
                            className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group relative overflow-hidden h-40 mb-4"
                        >
                            {logo ? (
                                <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                            ) : (
                                <>
                                    <BuildingOfficeIcon className="w-12 h-12 text-slate-400 mb-2 group-hover:scale-110 transition-transform" />
                                    <p className="text-xs font-bold text-slate-500">Upload Logo File</p>
                                </>
                            )}
                            <input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
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
                                <button onClick={handleSetLogoUrl} className="px-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-emerald-500 hover:text-white transition-all">
                                    <PlusIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900">
                        <div className="flex items-center gap-3 mb-4">
                            <GlobeAltIcon className="w-5 h-5 text-emerald-500" />
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Public Presence</h3>
                        </div>
                        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                            Your company profile is visible to all candidates on the platform. Keep it updated to attract top talent.
                        </p>
                        <Button variant="ghost" size="sm" className="w-full text-xs font-bold ring-1 ring-slate-200 dark:ring-slate-700" onClick={() => window.open('/company/preview', '_blank')}>
                            Preview Public Profile
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
