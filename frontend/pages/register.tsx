import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Smartphone, ArrowRight, Loader2, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

interface RegisterForm {
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
}

export default function Register() {
    const [countryCode, setCountryCode] = useState('+91');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register: registerUser } = useAuth(); // Rename to avoid conflict with useForm register
    const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterForm>();
    const router = useRouter();

    const onSubmit = async (data: RegisterForm) => {
        if (data.password !== data.confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        setIsSubmitting(true);
        try {
            await registerUser(data.email, data.password, 'user', `${countryCode}${data.phone}`);
            // Redirect is handled in AuthContext
        } catch (error: any) {
            // Error toast handled in AuthContext
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-md mx-auto pt-10 pb-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100"
                >
                    <div className="mb-8">
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Create Account</h2>
                        <p className="text-slate-400 mt-2 font-medium">Join us to boost your productivity</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600 ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    {...register('email', { required: true })}
                                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600 ml-1">Phone Number</label>
                            <div className="flex space-x-2">
                                <div className="relative w-1/3">
                                    <select
                                        value={countryCode}
                                        onChange={(e) => setCountryCode(e.target.value)}
                                        className="appearance-none block w-full pl-4 pr-8 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                                    >
                                        <option value="+91">IN +91</option>
                                        <option value="+1">US +1</option>
                                        <option value="+44">UK +44</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                    </div>
                                </div>
                                <div className="relative w-2/3">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                        <Smartphone size={20} />
                                    </div>
                                    <input
                                        type="tel"
                                        {...register('phone', { required: true })}
                                        className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                                        placeholder="9876543210"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600 ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    {...register('password', { required: true, minLength: 6 })}
                                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600 ml-1">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    {...register('confirmPassword', { required: true })}
                                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center space-x-2 py-4 px-4 border border-transparent rounded-2xl text-lg font-bold text-white premium-gradient premium-shadow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {isSubmitting ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 font-medium">
                            Already have an account?{' '}
                            <Link href="/login" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}