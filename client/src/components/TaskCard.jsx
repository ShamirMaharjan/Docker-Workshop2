import { useState } from 'react';
import { CheckCircle, Circle, ArrowRight, EllipsisVertical, Trash2, Edit2, Calendar as CalendarIcon } from 'lucide-react';

export default function TaskCard({ task, onStatusChange, onDelete, onEdit }) {
    const [showMenu, setShowMenu] = useState(false);

    const priorityColors = {
        low: 'bg-green-100 text-green-700',
        medium: 'bg-yellow-100 text-yellow-700',
        high: 'bg-red-100 text-red-700',
    };

    const formatDueDate = (dateString) => {
        const due = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);

        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const formattedDate = due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

        if (diffDays === 0) return `Due today (${formattedDate})`;
        if (diffDays === 1) return `Due tomorrow (${formattedDate})`;
        if (diffDays < 0) return `Overdue (${formattedDate})`;
        return `Due in ${diffDays} days (${formattedDate})`;
    };

    return (
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-2 sm:mb-3">
                <div className="flex items-center gap-2 sm:gap-3 pr-2">
                    <button
                        onClick={() => onStatusChange(task._id, 'cleared')}
                        className="text-gray-300 hover:text-blue-600 transition-colors shrink-0"
                    >
                        {task.status === 'cleared' ? <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" /> : <Circle className="h-5 w-5 sm:h-6 sm:w-6" />}
                    </button>
                    <h3 className={`font-bold text-sm sm:text-base text-gray-900 leading-tight ${task.status === 'cleared' ? 'line-through text-gray-400' : ''}`}>
                        {task.title}
                    </h3>
                </div>
                
                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                    <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
                        {task.priority.toUpperCase()}
                    </span>

                    <div className="relative"> 
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="text-gray-400 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 transition-colors"
                        >
                            <EllipsisVertical className="h-4 w-4" />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 animate-in fade-in zoom-in-95 duration-100">
                                <button onClick={() => { setShowMenu(false); onEdit(task); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                    <Edit2 className="h-4 w-4" /> Edit
                                </button>
                                <button onClick={() => { setShowMenu(false); onDelete(task._id); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2">
                                    <Trash2 className="h-4 w-4" /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-500 ml-7 sm:ml-9 mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                {task.description || 'No description provided.'}
            </p>

            <div className="flex justify-between items-center ml-7 sm:ml-9 border-t border-gray-50 pt-3">
                <div className="flex flex-col gap-1">
                    {task.dueDate && (
                        <div className={`flex items-center text-[10px] sm:text-xs font-bold gap-1 ${new Date(task.dueDate) < new Date() ? 'text-red-600' : 'text-blue-600'}`}>
                            <CalendarIcon className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                            <span>{formatDueDate(task.dueDate)}</span>
                        </div>
                    )}
                    <div className="flex items-center text-[9px] sm:text-[10px] font-bold text-gray-400 gap-1">
                        <span>Created: {new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                </div>

                {task.status === 'stashed' && (
                    <button
                        onClick={() => onStatusChange(task._id, 'active')}
                        className="text-[10px] sm:text-xs font-bold text-blue-600 flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-blue-50 px-2 py-1 rounded-md hover:bg-blue-100"
                    >
                        Focus <ArrowRight className="h-3 w-3" />
                    </button>
                )}
            </div>

            {showMenu && <div className="fixed inset-0 z-0" onClick={() => setShowMenu(false)} />}
        </div>
    );
}