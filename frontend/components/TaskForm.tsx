import React, { useState } from 'react';
import { PlusCircle, Send, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskFormProps {
    onSubmit: (title: string, description?: string) => void;
    onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isExpanded, setIsExpanded] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit(title, description);
        setTitle('');
        setDescription('');
        setIsExpanded(false);
    };

    const handleCancel = () => {
        setTitle('');
        setDescription('');
        setIsExpanded(false);
        onCancel?.();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl shadow-slate-200/50 transition-all duration-300"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
                        <PlusCircle size={24} />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Create New Task</h2>
                </div>
                {onCancel && (
                    <button
                        onClick={handleCancel}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div>
                    <label className="text-sm font-bold text-slate-600 ml-1 block mb-2">Task Title *</label>
                    <input
                        type="text"
                        placeholder="What needs to be done?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onFocus={() => setIsExpanded(true)}
                        className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:ring-0 transition-all text-slate-800 placeholder-slate-400 font-medium"
                        required
                    />
                </div>

                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div>
                            <label className="text-sm font-bold text-slate-600 ml-1 block mb-2">Description</label>
                            <textarea
                                placeholder="Add more details about this task..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:ring-0 transition-all text-slate-800 placeholder-slate-400 min-h-[120px] resize-none"
                                rows={4}
                            />
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!title.trim()}
                                className="flex items-center justify-center space-x-2 px-8 py-3 rounded-xl text-sm font-bold text-white premium-gradient premium-shadow hover:opacity-90 disabled:opacity-50 transition-all active:scale-95"
                            >
                                <Send size={18} />
                                <span>Create Task</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </form>
        </motion.div>
    );
};

export default TaskForm;
