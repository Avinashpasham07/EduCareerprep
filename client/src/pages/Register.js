import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/slices/authSlice';
import { Navigate, Link } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import { Button } from '../components/common';
import {
  AcademicCapIcon,
  BuildingLibraryIcon,
  BriefcaseIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

// Dynamic Validation Schemas
const baseSchema = {
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
};

const studentSchema = z.object({
  ...baseSchema,
  name: z.string().min(2, 'Name is required'),
  skills: z.string().optional(),
});

const collegeSchema = z.object({
  ...baseSchema,
  name: z.string().min(2, 'College Name is required'),
  location: z.string().min(2, 'Location is required'),
});

const recruiterSchema = z.object({
  ...baseSchema,
  name: z.string().min(2, 'Company Name is required'),
});

export default function Register() {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((s) => s.auth);
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);

  // Select schema based on role
  const currentSchema = role === 'counselor' ? collegeSchema :
    role === 'employer' ? recruiterSchema :
      studentSchema;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(currentSchema),
    context: { role } // Pass context if needed for complex validation
  });

  if (user) return <Navigate to="/dashboard" replace />;

  const onSubmit = (data) => {
    // Dispatch register action with role and specific data
    dispatch(registerUser({ ...data, role }));
  };

  const roles = [
    { id: 'student', label: 'Student', icon: <AcademicCapIcon className="w-5 h-5" /> },
    { id: 'counselor', label: 'College', icon: <BuildingLibraryIcon className="w-5 h-5" /> },
    { id: 'employer', label: 'Recruiter', icon: <BriefcaseIcon className="w-5 h-5" /> },
  ];

  return (
    <AuthLayout
      title="Create Account"
      subtitle={`Join as a ${roles.find(r => r.id === role)?.label}`}
    >
      {/* Premium Role Selection Tabs */}
      <div className="bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-2xl flex mb-8 border border-slate-200 dark:border-slate-800">
        {roles.map((r) => (
          <button
            key={r.id}
            onClick={() => setRole(r.id)}
            className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${role === r.id
              ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-md scale-100'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50'
              }`}
          >
            <span className="mr-2">{r.icon}</span>
            {r.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Dynamic Name Field */}
        <div>
          <label className="label-premium">
            {role === 'counselor' ? 'College Name' : role === 'employer' ? 'Company Name' : 'Full Name'}
          </label>
          <input
            className="input-premium"
            placeholder={role === 'counselor' ? 'e.g. IIT Delhi' : role === 'employer' ? 'e.g. Google' : 'Your full name'}
            {...register('name')}
          />
          {errors.name && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="label-premium">
            {role === 'employer' ? 'Work Email' : role === 'counselor' ? 'Admin Email' : 'Email Address'}
          </label>
          <input
            type="email"
            className="input-premium"
            placeholder="name@example.com"
            {...register('email')}
          />
          {errors.email && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.email.message}</p>}
        </div>

        {/* Role Specific Fields */}
        {role === 'counselor' && (
          <div className="animate-fade-in-up">
            <label className="label-premium">Location</label>
            <input
              className="input-premium"
              placeholder="City, State"
              {...register('location')}
            />
            {errors.location && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.location.message}</p>}
          </div>
        )}

        {role === 'student' && (
          <div className="animate-fade-in-up">
            <label className="label-premium">Top Skills</label>
            <input
              className="input-premium"
              placeholder="e.g. React, Python, Design (Comma separated)"
              {...register('skills')}
            />
            <p className="text-xs text-slate-500 mt-1 ml-1">Helps match you with relevant jobs immediately.</p>
          </div>
        )}

        <div>
          <label className="label-premium">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="input-premium pr-10"
              placeholder="Create a strong password"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.password.message}</p>}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-4 flex items-start animate-scale-in">
            <div className="text-red-500 mr-3">
              <ExclamationTriangleIcon className="w-5 h-5" />
            </div>
            <p className="text-red-600 dark:text-red-400 text-sm font-medium pt-0.5">{error}</p>
          </div>
        )}

        <Button
          variant="none"
          size="lg"
          className="w-full bg-green-400 text-white text-xl font-bold py-4 mt-2"
          loading={status === 'loading'}
        >
          Create Account
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Already have an account?
          <Link to="/login" className="text-primary-600 font-bold ml-1 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
