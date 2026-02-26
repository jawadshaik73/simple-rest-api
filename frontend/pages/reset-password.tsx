import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, Loader2, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import axios from 'axios';

interface ResetPasswordForm {
    code?: string;
    newPassword: string;
    confirmPassword: string;
}

export default function ResetPassword() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailFromLink, setEmailFromLink] = useState<string>('');
    const [tokenFromLink, setTokenFromLink] = useState<string>('');
    const [isFromEmailLink, setIsFromEmailLink] = useState(false);
    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<ResetPasswordForm>();
    const router = useRouter();

    useEffect(() => {
        // Check if we have query parameters from email link
        const { token, email, method } = router.query;
        
        if (token && email) {
            setEmailFromLink(email as string);
            setTokenFromLink(token as string);
            setIsFromEmailLink(true);
        }
    }, [router.query]);

    const onSubmit = async (data: ResetPasswordForm) => {
        setIsSubmitting(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
            
            let payload: any = {
                newPassword: data.newPassword
            };

            if (isFromEmailLink) {
                // For email link: use token from URL
                payload.token = tokenFromLink;
                payload.email = emailFromLink;
            } else {
                // For SMS/manual code entry: use the code
                if (!data.code) {
                    toast.error('Please enter the reset code');
                    return;
                }
                payload.code = data.code;
            }

            await axios.post(`${API_URL}/auth/reset-password`, payload);

            toast.success('Password reset successful! Redirecting to login...');
            
            setTimeout(() => {
                router.push('/login');
            }, 2000);

        } catch (error: any) {
            console.error('Reset error:', error);
            toast.error(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-md mx-auto pt-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100"
                >
                    <div className="mb-8">
                        <Link href="/login" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors mb-6">
                            <ArrowLeft size={16} className="mr-1" />
                            Back to Login
                        </Link>
                        <div className="flex items-center mb-4">
                            <Shield className="text-indigo-500 mr-3" size={32} />
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Reset Password</h2>
                        </div>
                        <p className="text-slate-400 mt-2 font-medium">
                            {isFromEmailLink 
                                ? 'Create a new password for your account' 
                                : 'Enter the reset code and create a new password'
                            }
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {!isFromEmailLink && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-600 ml-1">Reset Code</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                        <Shield size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        {...register('code', { 
                                            required: 'Reset code is required',
                                            pattern: {
                                                value: /^\d{6}$/,
                                                message: "Code must be 6 digits"
                                            }
                                        })}
                                        placeholder="123456"
                                        className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all ${errors.code ? 'border-rose-100 focus:border-rose-500' : 'border-transparent focus:border-indigo-500'}`}
                                    />
                                </div>
                                {errors.code && <p className="text-rose-500 text-xs font-bold mt-1 ml-1">{errors.code.message}</p>}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600 ml-1">New Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    {...register('newPassword', { 
                                        required: 'New password is required',
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters"
                                        }
                                    })}
                                    placeholder="••••••••"
                                    className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all ${errors.newPassword ? 'border-rose-100 focus:border-rose-500' : 'border-transparent focus:border-indigo-500'}`}
                                />
                            </div>
                            {errors.newPassword && <p className="text-rose-500 text-xs font-bold mt-1 ml-1">{errors.newPassword.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600 ml-1">Confirm New Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    {...register('confirmPassword', {
                                        required: 'Please confirm your password',
                                        validate: (val) => val === watch('newPassword') || 'Passwords do not match'
                                    })}
                                    placeholder="••••••••"
                                    className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all ${errors.confirmPassword ? 'border-rose-100 focus:border-rose-500' : 'border-transparent focus:border-indigo-500'}`}
                                />
                            </div>
                            {errors.confirmPassword && <p className="text-rose-500 text-xs font-bold mt-1 ml-1">{errors.confirmPassword.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-14 flex items-center justify-center space-x-2 rounded-2xl text-white font-bold premium-gradient premium-shadow hover:opacity-90 disabled:opacity-50 transition-all active:scale-95 mt-8"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    <Shield size={20} />
                                    <span>Reset Password</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-500">
                            Didn't receive a code?{' '}
                            <Link href="/forgot-password" className="text-indigo-600 font-bold hover:underline">
                                Request again
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}