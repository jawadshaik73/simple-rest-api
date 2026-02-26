import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { getTasks, createTask, updateTask, deleteTask, getAdminStats } from '../lib/api';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, List, CheckCircle, Clock, AlertCircle, Users, BarChart3, TrendingUp, Shield } from 'lucide-react';

interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    createdAt: string;
}

interface AdminStats {
    totalUsers: number;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    completionRate: number;
}

export default function Dashboard() {
    const { user, token, loading: authLoading } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [adminStats, setAdminStats] = useState<AdminStats | null>(null);

    const fetchTasks = async () => {
        if (!token) return;
        try {
            setLoading(true);
            setError(null);
            const data = await getTasks(token);
            setTasks(data);
        } catch (error) {
            console.error(error);
            setError('Could not load your tasks. Please check your connection.');
            toast.error('Could not load your tasks. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchAdminStats = async () => {
        if (!token || user?.role !== 'admin') return;
        try {
            const stats = await getAdminStats(token);
            setAdminStats(stats);
        } catch (error) {
            console.error('Failed to fetch admin stats:', error);
        }
    };

    useEffect(() => {
        if (!authLoading && token) {
            fetchTasks();
            fetchAdminStats();
        }
    }, [token, authLoading]);

    const handleCreate = async (title: string, description?: string) => {
        if (!token) return;
        try {
            const newTask = await createTask(token, { title, description });
            setTasks([newTask, ...tasks]);
            setShowForm(false);
            toast.success('Task added to your list!');
        } catch (error) {
            toast.error('Failed to create task.');
        }
    };

    const handleUpdate = async (id: string, updates: Partial<Task>) => {
        if (!token) return;
        try {
            const updated = await updateTask(token, id, updates);
            setTasks(tasks.map(t => t.id === id ? updated : t));
        } catch (error) {
            toast.error('Failed to update task.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!token) return;
        try {
            await deleteTask(token, id);
            setTasks(tasks.filter(t => t.id !== id));
            toast.success('Task removed.');
        } catch (error) {
            toast.error('Failed to delete task.');
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    if (!user) {
        return (
            <Layout>
                <div className="max-w-md mx-auto mt-20 text-center p-10 bg-white rounded-[2.5rem] shadow-xl border border-slate-100">
                    <div className="bg-rose-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
                        <AlertCircle size={40} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-800 mb-4">Access Denied</h1>
                    <p className="text-slate-500 mb-8 font-medium">Please sign in to view your personalized dashboard.</p>
                    <motion.a
                        href="/login"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl premium-shadow"
                    >
                        Go to Login
                    </motion.a>
                </div>
            </Layout>
        );
    }

    const completedCount = tasks.filter(t => t.completed).length;
    const pendingCount = tasks.length - completedCount;

    return (
        <Layout>
            <Head>
                <title>Dashboard | TaskMaster Pro</title>
                <meta name="description" content="Manage your tasks and track productivity with TaskMaster Pro dashboard" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div className="max-w-5xl mx-auto space-y-8 px-4 sm:px-0">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                                <span className="text-indigo-600">Dashboard</span>
                            </h1>
                            <p className="text-slate-500 mt-2 font-medium text-lg">
                                Welcome back, <span className="text-slate-700 font-bold">{user.email.split('@')[0]}</span>!
                                {user.role === 'admin' && (
                                    <span className="ml-2 inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-lg text-xs font-bold border border-amber-200">
                                        <Shield size={12} /> Admin
                                    </span>
                                )}
                            </p>
                        </motion.div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowForm(!showForm)}
                        className={`w-full md:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl font-bold text-white transition-all premium-shadow ${showForm ? 'bg-slate-800 hover:bg-slate-900' : 'premium-gradient hover:opacity-90'}`}
                    >
                        {showForm ? <List size={20} /> : <Plus size={20} />}
                        <span>{showForm ? 'View All Tasks' : 'Create New Task'}</span>
                    </motion.button>
                </header>

                {/* Admin Stats Panel */}
                {user.role === 'admin' && adminStats && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-6 sm:p-8 rounded-3xl text-white shadow-2xl"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
                                <BarChart3 size={22} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">Platform Overview</h2>
                                <p className="text-white/70 text-sm">Admin-only statistics</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                                <div className="flex items-center gap-2 text-white/70 text-xs font-bold uppercase tracking-wider mb-1">
                                    <Users size={14} /> Users
                                </div>
                                <p className="text-3xl font-black">{adminStats.totalUsers}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                                <div className="flex items-center gap-2 text-white/70 text-xs font-bold uppercase tracking-wider mb-1">
                                    <List size={14} /> Tasks
                                </div>
                                <p className="text-3xl font-black">{adminStats.totalTasks}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                                <div className="flex items-center gap-2 text-white/70 text-xs font-bold uppercase tracking-wider mb-1">
                                    <CheckCircle size={14} /> Done
                                </div>
                                <p className="text-3xl font-black">{adminStats.completedTasks}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                                <div className="flex items-center gap-2 text-white/70 text-xs font-bold uppercase tracking-wider mb-1">
                                    <TrendingUp size={14} /> Rate
                                </div>
                                <p className="text-3xl font-black">{adminStats.completionRate}%</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Personal Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    {[
                        { icon: <List size={24} />, label: 'Total Tasks', value: tasks.length, color: 'indigo' },
                        { icon: <CheckCircle size={24} />, label: 'Completed', value: completedCount, color: 'emerald' },
                        { icon: <Clock size={24} />, label: 'In Progress', value: pendingCount, color: 'amber' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`bg-${stat.color}-50 p-3 rounded-2xl text-${stat.color}-600`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                                    <p className="text-2xl font-black text-slate-800">{stat.value}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Task Section */}
                <section className="relative min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {showForm ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <TaskForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin mb-4" />
                                        <p className="text-slate-400 font-medium">Syncing with server...</p>
                                    </div>
                                ) : error ? (
                                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-lg p-10">
                                        <div className="bg-rose-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
                                            <AlertCircle size={32} />
                                        </div>
                                        <p className="text-slate-800 font-bold mb-2 text-lg">Oops!</p>
                                        <p className="text-slate-500 font-medium mb-6">{error}</p>
                                        <button
                                            onClick={fetchTasks}
                                            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                                        >
                                            Retry Connection
                                        </button>
                                    </div>
                                ) : (
                                    <TaskList
                                        tasks={tasks}
                                        onUpdate={handleUpdate}
                                        onDelete={handleDelete}
                                        isAdmin={user.role === 'admin'}
                                    />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            </div>
        </Layout>
    );
}
