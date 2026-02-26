import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Smartphone, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import axios from 'axios';

type ResetMethod = 'email' | 'sms';

interface ForgotPasswordForm {
    email?: string;
    phone?: string;
}

export default function ForgotPassword() {
    const [method, setMethod] = useState<ResetMethod>('email');
    const [countryCode, setCountryCode] = useState('+91');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ForgotPasswordForm>();
    const router = useRouter();

    const onSubmit = async (data: ForgotPasswordForm) => {
        setIsSubmitting(true);
        try {
            const payload = {
                method,
                contact: method === 'email' ? data.email : `${countryCode}${data.phone}`
            };
            
            // Call API
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
            await axios.post(`${API_URL}/auth/forgot-password`, payload);

            toast.success(method === 'email' ? 'Reset link sent to your email!' : 'OTP sent to your phone!');
            
            // Redirect to reset password page (simulate flow)
            setTimeout(() => {
                router.push('/reset-password');
            }, 1500);

        } catch (error: any) {
            console.error('Full error:', error);
            console.error('Error response:', error.response);
            console.error('Error status:', error.response?.status);
            console.error('Error data:', error.response?.data);
            toast.error(error.response?.data?.message || 'Failed to send reset request');
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
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Reset Password</h2>
                        <p className="text-slate-400 mt-2 font-medium">Choose a method to reset your password</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button
                            type="button"
                            onClick={() => { setMethod('email'); reset(); }}
                            className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${method === 'email' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                        >
                            <Mail size={24} className="mb-2" />
                            <span className="font-bold text-sm">Email</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => { setMethod('sms'); reset(); }}
                            className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${method === 'sms' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                        >
                            <Smartphone size={24} className="mb-2" />
                            <span className="font-bold text-sm">SMS</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {method === 'email' ? (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-600 ml-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        {...register('email', { 
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                        placeholder="name@example.com"
                                        className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all ${errors.email ? 'border-rose-100 focus:border-rose-500' : 'border-transparent focus:border-indigo-500'}`}
                                    />
                                </div>
                                {errors.email && <p className="text-rose-500 text-xs font-bold mt-1 ml-1">{errors.email.message}</p>}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-600 ml-1">Phone Number</label>
                                <div className="flex space-x-2">
                                    <select
                                        className="px-3 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold text-slate-600 appearance-none text-center min-w-[80px]"
                                        value={countryCode}
                                        onChange={(e) => setCountryCode(e.target.value)}
                                    >
                                        <option value="+91">🇮🇳 +91</option>
                                        <option value="+1">🇺🇸 +1</option>
                                        <option value="+44">🇬🇧 +44</option>
                                        <option value="+971">🇦🇪 +971</option>
                                    </select>
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                            <Smartphone size={20} />
                                        </div>
                                        <input
                                            type="tel"
                                            {...register('phone', { required: 'Phone number is required' })}
                                            placeholder="9876543210"
                                            className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all ${errors.phone ? 'border-rose-100 focus:border-rose-500' : 'border-transparent focus:border-indigo-500'}`}
                                        />
                                    </div>
                                </div>
                                {errors.phone && <p className="text-rose-500 text-xs font-bold mt-1 ml-1">{errors.phone.message}</p>}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-14 flex items-center justify-center space-x-2 rounded-2xl text-white font-bold premium-gradient premium-shadow hover:opacity-90 disabled:opacity-50 transition-all active:scale-95 mt-8"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    <span>Send Reset Link</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </Layout>
    );
}
