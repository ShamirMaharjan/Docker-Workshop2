import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Plus, LayoutDashboard } from 'lucide-react';
import TaskCard from '../components/TaskCard';
import Navbar from '../components/Navbar';

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    
    // Dummy data for visual testing before we hook up the backend
    const [tasks, setTasks] = useState([
        { _id: '1', title: 'Plan database schema', description: 'Map out the user and task collections', status: 'backlog', priority: 'high', createdAt: new Date() },
        { _id: '2', title: 'Setup CORS', description: 'Make sure frontend can talk to backend', status: 'completed', priority: 'high', createdAt: new Date() },
        { _id: '3', title: 'Design landing page', description: 'Create a highly converting landing page for the assessment', status: 'focus', priority: 'medium', createdAt: new Date() },
    ]);

    // This will eventually hit your backend API
    const handleStatusChange = (taskId, newStatus) => {
        setTasks(tasks.map(task => 
            task._id === taskId ? { ...task, status: newStatus } : task
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Top Navigation */}
            <Navbar />

            {/* Main Board */}
            <main className="max-w-7xl mx-auto p-6 lg:p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">Your Workflow</h1>
                        <p className="text-gray-500 mt-1">Manage your priorities and focus for today.</p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all">
                        <Plus className="h-5 w-5" /> New Task
                    </button>
                </div>

                {/* The Pipeline Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* Column 1: Stashed */}
                    <div className="bg-gray-100/50 p-4 rounded-2xl border border-gray-200/60">
                        <h2 className="font-bold text-gray-700 mb-4 flex justify-between items-center">
                            Stashed
                            <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                {tasks.filter(t => t.status === 'backlog').length}
                            </span>
                        </h2>
                        <div className="space-y-4">
                            {tasks.filter(t => t.status === 'backlog').map(task => (
                                <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} />
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Focus Lane */}
                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                        <h2 className="font-bold text-blue-800 mb-4 flex justify-between items-center">
                            Focus Lane
                            <span className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                                {tasks.filter(t => t.status === 'focus').length}
                            </span>
                        </h2>
                        <div className="space-y-4">
                            {tasks.filter(t => t.status === 'focus').map(task => (
                                <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} />
                            ))}
                        </div>
                    </div>

                    {/* Column 3: Completed */}
                    <div className="bg-gray-100/50 p-4 rounded-2xl border border-gray-200/60 opacity-70">
                        <h2 className="font-bold text-gray-500 mb-4 flex justify-between items-center">
                            Completed
                            <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                {tasks.filter(t => t.status === 'completed').length}
                            </span>
                        </h2>
                        <div className="space-y-4">
                            {tasks.filter(t => t.status === 'completed').map(task => (
                                <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} />
                            ))}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}