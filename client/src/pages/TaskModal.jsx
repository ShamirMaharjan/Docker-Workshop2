import { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Flag } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, onSave, editingTask }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('medium');

    useEffect(() => {
        if (isOpen && editingTask) {
            setTitle(editingTask.title);
            setDescription(editingTask.description || '');
            setDueDate(editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().split('T')[0] : '');
            setPriority(editingTask.priority);
        } else if (isOpen) {
            setTitle('');
            setDescription('');
            setDueDate('');
            setPriority('medium');
        }
    }, [isOpen, editingTask]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        
        await onSave(title, description, dueDate, priority, editingTask?._id);
        onClose();
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none`}>
            
            {/* The Background Overlay (Fades In) */}
            <div 
                className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`} 
                onClick={onClose} 
            />

            {/* The Modal Container (Springs from bottom-right on mobile, center on desktop) */}
            <div 
                className={`bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 relative flex flex-col transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                origin-bottom-right md:origin-center
                ${isOpen ? 'scale-100 opacity-100 pointer-events-auto translate-y-0 translate-x-0' : 'scale-50 opacity-0 translate-y-24 translate-x-12 md:translate-y-0 md:translate-x-0'}`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black text-gray-900">
                        {editingTask ? 'Edit Task' : 'New Task'}
                    </h2>
                    <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full text-gray-500">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <input
                            type="text"
                            placeholder="Task title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full text-xl font-bold px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all placeholder:text-gray-400 placeholder:font-medium"
                            required
                        />
                    </div>
                    <div>
                        <textarea
                            placeholder="Add details..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all resize-none text-sm"
                        />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block tracking-wider">Due Date</label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all text-sm font-medium text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="flex-1 relative">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block tracking-wider">Priority</label>
                            <div className="relative">
                                <Flag className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all text-sm font-bold text-gray-700 appearance-none"
                                >
                                    <option value="low">Low Priority</option>
                                    <option value="medium">Medium Priority</option>
                                    <option value="high">High Priority</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md">
                            {editingTask ? 'Save Changes' : 'Initialize Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}