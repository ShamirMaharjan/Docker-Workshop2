import { useState } from 'react';
import { Plus } from 'lucide-react';
import TaskCard from '../components/TaskCard';
import Navbar from '../components/Navbar';
import { useTasks } from '../hooks/useTasks';
import TaskModal from './TaskModal';

export default function Dashboard() {
    const { tasks, loading, addTask, updateStatus, deleteTask, editTask } = useTasks();
    
    // State for the quick-add form
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);

    const handleQuickAdd = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        
        const success = await addTask(newTaskTitle, '', null, 'medium');
        if (success) setNewTaskTitle(''); // Clear input on success
    };

    const handleModalSave = async (title, desc, date, prio, editId) => {
        if (editId) {
            return await editTask(editId, title, desc, date, prio);
        } else {
            return await addTask(title, desc, date, prio);
        }
    }

    if (loading) return <div className="min-h-screen bg-gray-50 flex justify-center items-center font-bold text-blue-600">Loading Pipeline...</div>;

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleModalSave}
                editingTask={taskToEdit}
            />

            <main className="max-w-7xl mx-auto p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">Your Workflow</h1>
                        <p className="text-gray-500 mt-1">Manage your priorities and focus for today.</p>
                    </div>
                    
                    <form onSubmit={handleQuickAdd} className="flex w-full sm:w-auto gap-2">
                        <input 
                            type="text" 
                            placeholder="What's on your mind?" 
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                        />
                        <button type="submit" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold flex items-center shadow-sm transition-all whitespace-nowrap">
                            Stash
                        </button>
                    </form>

                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all w-full sm:w-auto justify-center"
                    >
                        <Plus className="h-5 w-5" /> New Task
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    <div className="bg-gray-100/50 p-4 rounded-2xl border border-gray-200/60">
                        <h2 className="font-bold text-gray-700 mb-4 flex justify-between items-center">
                            Stashed
                            <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                {tasks.filter(t => t.status === 'stashed').length}
                            </span>
                        </h2>
                        <div className="space-y-4">
                            {tasks.filter(t => t.status === 'stashed').map(task => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    onStatusChange={updateStatus}
                                    onDelete={deleteTask}
                                    onEdit={(task) => { setTaskToEdit(task); setIsModalOpen(true);  }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                        <h2 className="font-bold text-blue-800 mb-4 flex justify-between items-center">
                            Focus
                            <span className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                                {tasks.filter(t => t.status === 'focus').length}
                            </span>
                        </h2>
                        <div className="space-y-4">
                            {tasks.filter(t => t.status === 'focus').map(task => (
                                <TaskCard key={task._id} task={task} onStatusChange={updateStatus} onDelete={deleteTask} />
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-100/50 p-4 rounded-2xl border border-gray-200/60 opacity-70">
                        <h2 className="font-bold text-gray-500 mb-4 flex justify-between items-center">
                            Cleared
                            <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                {tasks.filter(t => t.status === 'cleared').length}
                            </span>
                        </h2>
                        <div className="space-y-4">
                            {tasks.filter(t => t.status === 'cleared').map(task => (
                                <TaskCard key={task._id} task={task} onStatusChange={updateStatus} onDelete={deleteTask} />
                            ))}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}