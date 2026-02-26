import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Shield, Zap, Sparkles, Lock, Users, BarChart3 } from 'lucide-react';

export default function Home() {
    return (
        <Layout>
            <Head>
                <title>TaskMaster Pro | Premium Task Management Platform</title>
                <meta name="description" content="Enterprise-grade task management with JWT authentication, role-based access control, and a premium dashboard. Built with Next.js & Node.js." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="relative overflow-hidden pt-8 sm:pt-12 pb-20 sm:pb-32">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold mb-8 border border-indigo-100"
                        >
                            <Sparkles size={16} />
                            <span>Next Generation Task Management</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6"
                        >
                            Master your <span className="text-indigo-600">Productivity</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
                        >
                            Effortlessly manage tasks, secure your data with enterprise-grade auth, and scale your workflow with our premium dashboard.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="mt-10 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
                        >
                            <Link
                                href="/register"
                                id="hero-cta-register"
                                className="group flex items-center space-x-2 px-8 py-4 rounded-2xl text-lg font-bold text-white premium-gradient premium-shadow hover:scale-105 transition-all active:scale-95 w-full sm:w-auto justify-center"
                            >
                                <span>Get Started for Free</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/login"
                                id="hero-cta-login"
                                className="px-8 py-4 rounded-2xl text-lg font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all w-full sm:w-auto text-center"
                            >
                                Sign In
                            </Link>
                        </motion.div>
                    </div>

                    {/* Features Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-20 sm:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
                    >
                        {[
                            { icon: <Zap size={24} />, title: "Lightning Fast", desc: "Built with Next.js 14 & Express for optimal performance and instant loads." },
                            { icon: <Shield size={24} />, title: "Secure by Design", desc: "JWT Authentication, bcrypt hashing, rate limiting & XSS protection built-in." },
                            { icon: <CheckCircle2 size={24} />, title: "Full CRUD", desc: "Create, read, update & delete tasks with real-time feedback and validation." }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + i * 0.15 }}
                                className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-indigo-100 hover:shadow-indigo-100/30 transition-all group"
                            >
                                <div className="premium-gradient w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Tech Stack Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="mt-20 sm:mt-24"
                    >
                        <h2 className="text-center text-2xl sm:text-3xl font-black text-slate-900 mb-12">
                            Built with <span className="text-indigo-600">Modern Stack</span>
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                            {[
                                { icon: <Lock size={20} />, label: "JWT Auth", sub: "Secure tokens" },
                                { icon: <Users size={20} />, label: "RBAC", sub: "Role-based access" },
                                { icon: <BarChart3 size={20} />, label: "Swagger", sub: "API docs" },
                                { icon: <Zap size={20} />, label: "PostgreSQL", sub: "Prisma ORM" },
                            ].map((tech, i) => (
                                <div key={i} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-md hover:shadow-lg transition-shadow text-center">
                                    <div className="bg-indigo-50 w-10 h-10 rounded-xl flex items-center justify-center text-indigo-600 mx-auto mb-3">
                                        {tech.icon}
                                    </div>
                                    <p className="font-bold text-slate-800 text-sm">{tech.label}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{tech.sub}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
}
