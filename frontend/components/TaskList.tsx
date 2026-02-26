import React, { useState } from 'react';
import { Trash2, Edit3, CheckCircle2, Circle, Clock, Menu, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    createdAt: string;
}

interface TaskListProps {
    tasks: Task[];
    onUpdate: (id: string, updates: Partial<Task>) => void;
    onDelete: (id: string) => void;
    isAdmin: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdate, onDelete, isAdmin }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [expandedMenuId, setExpandedMenuId] = useState<string | null>(null);

    const startEdit = (task: Task) => {
        setEditingId(task.id);
        setEditTitle(task.title);
        setEditDescription(task.description || '');
        setExpandedMenuId(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const saveEdit = (id: string) => {
        if (!editTitle.trim()) {
            cancelEdit();
            return;
        }
        onUpdate(id, { title: editTitle, description: editDescription });
        setEditingId(null);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this task?')) {
            onDelete(id);
        }
        setExpandedMenuId(null);
    };

    return (
        <div className="grid gap-4 sm:gap-6">
            {tasks.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16 sm:py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-lg shadow-slate-200/50"
                >
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock size={32} className="text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-medium text-sm sm:text-base">No tasks yet. Create your first task to get started!</p>
                </motion.div>
            ) : (
                <AnimatePresence mode="popLayout">
                    {tasks.map((task) => (
                        <motion.div
                            key={task.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`group bg-white p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 ${task.completed ? 'bg-slate-50/50 border-slate-50' : ''}`}
                        >
                            {editingId === task.id ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-3 sm:space-y-4"
                                >
                                    <div>
                                        <input
                                            type="text"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            className="w-full px-4 py-3 sm:py-4 bg-slate-50 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-all font-bold text-slate-800"
                                            placeholder="Task title"
                                            autoFocus
                                        />
                                    </div>
                                    <textarea
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-all text-slate-600 text-sm"
                                        rows={3}
                                        placeholder="Task description"
                                    />
                                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2 border-t border-slate-100">
                                        <button
                                            onClick={cancelEdit}
                                            className="px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => saveEdit(task.id)}
                                            className="px-6 py-2 rounded-lg text-sm font-bold text-white premium-gradient hover:opacity-90 transition-all shadow-md"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-0">
                                    <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                                        <button
                                            onClick={() => onUpdate(task.id, { completed: !task.completed })}
                                            className={`mt-1 flex-shrink-0 transition-all duration-300 ${task.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-400'}`}
                                        >
                                            {task.completed ? (
                                                <CheckCircle2 size={24} className="sm:size-6" />
                                            ) : (
                                                <Circle size={24} className="sm:size-6" />
                                            )}
                                        </button>

                                        <div className="flex-1 min-w-0">
                                            <h3 className={`text-base sm:text-lg font-bold transition-all duration-300 break-words ${task.completed ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-800'}`}>
                                                {task.title}
                                            </h3>
                                            {task.description && (
                                                <p className={`mt-1 text-xs sm:text-sm transition-all duration-300 line-clamp-2 ${task.completed ? 'text-slate-300' : 'text-slate-500'}`}>
                                                    {task.description}
                                                </p>
                                            )}
                                            <div className="flex flex-wrap items-center gap-2 mt-3">
                                                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                                                    {new Date(task.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                                {task.completed && (
                                                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                                                        Done
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop Actions */}
                                    <div className="hidden sm:flex gap-1 flex-shrink-0">
                                        <button
                                            onClick={() => startEdit(task)}
                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                            title="Edit Task"
                                        >
                                            <Edit3 size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(task.id)}
                                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                            title="Delete Task"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>

                                    {/* Mobile Actions */}
                                    <div className="sm:hidden flex-shrink-0 relative">
                                        <button
                                            onClick={() =>
                                                setExpandedMenuId(
                                                    expandedMenuId === task.id ? null : task.id
                                                )
                                            }
                                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                                        >
                                            <Menu size={20} />
                                        </button>

                                        <AnimatePresence>
                                            {expandedMenuId === task.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-slate-100 z-10 overflow-hidden"
                                                >
                                                    <button
                                                        onClick={() => startEdit(task)}
                                                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                    >
                                                        <Edit3 size={16} />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(task.id)}
                                                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors border-t border-slate-100"
                                                    >
                                                        <Trash2 size={16} />
                                                        Delete
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            )}
        </div>
    );
};

export default TaskList;
