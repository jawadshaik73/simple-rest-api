import React, { Fragment } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, CheckSquare, PlusCircle, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <nav className="glass sticky top-0 z-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center space-x-2">
                            <div className="premium-gradient p-2 rounded-lg text-white">
                                <CheckSquare size={24} />
                            </div>
                            <Link href="/" className="text-xl font-bold tracking-tight text-slate-800 hidden sm:block">
                                Task<span className="text-indigo-600">Master</span>
                            </Link>
                        </div>

                        <div className="flex items-center space-x-2 sm:space-x-4">
                            {user ? (
                                <>
                                    <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-slate-100 rounded-full text-sm font-medium border border-slate-200">
                                        <UserIcon size={14} className="text-indigo-600" />
                                        <span className="text-slate-600">{user.email}</span>
                                        {user.role === 'admin' && (
                                            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-amber-200">Admin</span>
                                        )}
                                    </div>

                                    <Link href="/dashboard" className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                                        <LayoutDashboard size={18} />
                                        <span className="hidden sm:inline">Dashboard</span>
                                    </Link>

                                    <button
                                        onClick={logout}
                                        className="flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-semibold text-white premium-gradient premium-shadow hover:opacity-90 transition-all active:scale-95"
                                    >
                                        <LogOut size={16} />
                                        <span className="hidden sm:inline">Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 px-4 py-2 transition-colors">
                                        Log in
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="flex items-center space-x-1 px-5 py-2.5 rounded-xl text-sm font-bold text-white premium-gradient premium-shadow hover:opacity-90 transition-all active:scale-95"
                                    >
                                        <span>Get Started</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {children}
                </motion.div>
            </main>

            <footer className="mt-auto py-8 text-center text-slate-400 text-sm border-t border-slate-100">
                &copy; {new Date().getFullYear()} TaskMaster Pro. Built for Performance.
            </footer>
        </div>
    );
};

export default Layout;
