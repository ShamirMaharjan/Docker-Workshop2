import { useState } from 'react';
import { X, AlignLeft, Flag, Calendar } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, onSave }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('medium');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        const success = await onSave(title, description, dueDate, priority || null);
        if (success) {
            setTitle('');
            setDescription('');
            setDueDate('');
            setPriority('medium');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="bg-white rounded-3x; shadow-2xl w-full max-w-lg p-6 relative animate-in slide-in-from-bottom-8">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-gray-900">Add New Task</h2>
                    <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <input
                            type="text"
                            placeholder="Task Title..."
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full text-lg font-bold px-4 py-3 bg-gray-50 border border-gray-200 rounded-1xl outline-none placeholder-gray-400"
                        />
                    </div>

                    <div className="relative">
                        <AlignLeft className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        <textarea
                            placeholder="Add details or notes..."
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray border border-gray-200 rounded-xl outline-none resize-none text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <Calendar className="absolute left=4 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm text-gray-700"
                            />
                        </div>

                        <div className="relative">
                            <Flag className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm text-gray-700 appearance-none"
                            >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-md mt-4">
                        Stash Task
                    </button>
                </form>
            </div>
        </div>
    );
}