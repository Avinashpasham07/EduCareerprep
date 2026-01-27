import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card } from '../common';
import { userApi } from '../../services/api';
import { updateUser } from '../../store/slices/authSlice';
import { BuildingOfficeIcon, GlobeAltIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function CompanyProfileEditor() {
    const { user } = useSelector((s) => s.auth);
    const dispatch = useDispatch();
    const profile = user?.profile?.companyProfile || {};

    const { register, handleSubmit } = useForm({
        defaultValues: {
            name: user?.name || '',
            location: user?.location || '',
            description: profile.description || '',
            website: profile.website || '',
            size: profile.size || '1-50',
            industry: profile.industry || '',
            benefits: profile.benefits?.join(', ') || ''
        }
    });

    const onSubmit = async (data) => {
        try {
            const payload = {
                name: data.name,
                location: data.location,
                profile: {
                    ...user.profile,
                    companyProfile: {
                        ...profile,
                        description: data.description,
                        website: data.website,
                        size: data.size,
                        industry: data.industry,
                        benefits: data.benefits.split(',').map(b => b.trim()).filter(Boolean)
                    }
                }
            };

            const res = await userApi.updateProfile(payload);
            dispatch(updateUser(res.data));
            alert('Company profile updated successfully! 🚀');
        } catch (err) {
            console.error(err);
            alert('Failed to update profile ❌');
        }
    };

    const formStyles = {
        input: "w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-400 font-medium",
        label: "block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide",
        textarea: "w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-400 min-h-[140px] resize-y font-medium",
        select: "w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200 text-slate-900 dark:text-white font-medium appearance-none cursor-pointer"
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Company Profile</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">Manage your employer brand and company details</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="ghost" onClick={() => window.open('/company/preview', '_blank')}>
                        <GlobeAltIcon className="w-5 h-5 mr-2" />
                        View Public Page
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-8 border-slate-200 dark:border-slate-800 shadow-xl">
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
                                    <input className={formStyles.input} {...register('name')} placeholder="e.g. Acme Inc." />
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
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">https://</span>
                                        <input className={`${formStyles.input} pl-20`} {...register('website')} placeholder="www.example.com" />
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
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={formStyles.label}>Industry</label>
                                    <input className={formStyles.input} {...register('industry')} placeholder="e.g. Fintech, EdTech" />
                                </div>
                                <div>
                                    <label className={formStyles.label}>Perks & Benefits (Comma separated)</label>
                                    <input className={formStyles.input} {...register('benefits')} placeholder="Remote work, Health insurance..." />
                                </div>
                            </div>
                        </form>
                    </Card>

                    <div className="flex justify-end pt-4">
                        <Button size="lg" onClick={handleSubmit(onSubmit)} className="px-8 shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 text-white">
                            Save Changes
                        </Button>
                    </div>
                </div>

                {/* Right: Branding & Media */}
                <div className="space-y-6">
                    <Card className="p-6 border-slate-200 dark:border-slate-800 shadow-lg">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Company Logo</h3>
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all cursor-pointer group hover:border-emerald-400">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-4xl mb-4 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                                🏢
                            </div>
                            <p className="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-emerald-500 transition-colors">Upload New Logo</p>
                            <p className="text-xs text-slate-400 mt-1">Recommended: 512x512px</p>
                        </div>
                    </Card>

                    <Card className="p-6 border-slate-200 dark:border-slate-800 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Office Gallery</h3>
                            <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-wide">Manage</button>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 relative group overflow-hidden cursor-pointer hover:shadow-md transition-all">
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                        <span className="text-white text-xs font-bold uppercase tracking-wider">Edit</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="secondary" className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-400 text-slate-500 hover:text-emerald-500 font-bold bg-transparent">
                            + Add Photos
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
