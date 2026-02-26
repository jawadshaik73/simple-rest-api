import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginForm {
    email: string;
    password: string;
}

export default function Login() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
    const { login } = useAuth();

    const onSubmit = async (data: LoginForm) => {
        setIsSubmitting(true);
        try {
            await login(data.email, data.password);
            // Redirect is handled in AuthContext
        } catch (error) {
            // Error toast is handled in AuthContext
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
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Welcome Back</h2>
                        <p className="text-slate-400 mt-2 font-medium">Sign in to continue to your dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-bold text-slate-600">Password</label>
                                <Link href="/forgot-password" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    {...register('password', { required: true })}
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
                                    <span>Sign In</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 font-medium">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
                                Create one
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}