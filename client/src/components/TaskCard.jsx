import { Clock, CheckCircle, Circle, ArrowRight } from 'lucide-react';

export default function TaksCard({ task, onStatusChange }) {
    const priorityColors = {
        low: 'bg-green-100 text-green-700',
        medium: 'bg-yellow-100 text-yellow-700',
        high: 'bg-red-100 text-red-700',
    };

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onStatusChange(task._id, 'completed')}
                        className="text-gray-300 hover:text-blue-600 transition-colors"
                    >
                        {task.status === 'completed' ? <CheckCircle className="h-6 w-6 text-blue-600" /> : <Circle className="h-6 w-6" />}
                    </button>
                    <h3 className={`font-bold text-gray-900 ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
                        {task.title}
                    </h3>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${priorityColors[task.priority]}`}>
                    {task.priority.toUpperCase()}
                </span>
            </div>

            <p className="text-sm text-gray-500 ml-9 mb-4 line-clamp-2">
                {task.description || 'No description provided.'}
            </p>

            <div className="flex justify-between items-center ml-9 border-t border-gray-50 pt-3">
                <div className="flex items-center text-xs font-medium text-gray-400 gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                </div>

                {task.status === 'backlog' && (
                    <button
                        onClick={() => onStatusChange(task._id, 'focus')}
                        className="text-xs font-bold text-blue-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        Move to Focus <ArrowRight className="h-3 w-3" />
                    </button>
                )}
            </div>
        </div>
    )
}