import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import Navbar from '../components/Navbar';
import { Flame, CheckCircle, Target, Shield, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
    const { user } = useContext(AuthContext);
    const { tasks } = useTasks();

    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isSecurityOpen, setIsSecurityOpen] = useState(false);

    const clearedTasksCount = tasks.filter(t => t.status === 'cleared').length;
    const activeTasksCount = tasks.filter(t => t.status === 'active').length;
    
    const currentStreak = 4; //mock data

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            <main className="max-w-4xl mx-auto p-6 lg:p-8">
                
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/dashboard" className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-500">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">Commander Profile</h1>
                        <p className="text-gray-500 mt-1">Track your performance and manage your identity.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/*left column*/}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10"></div>
                            
                            <div className="h-20 w-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-black mb-4">
                                {user?.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                            <p className="text-sm text-gray-500 mb-6">{user?.email}</p>

                            <div className="space-y-3">
                                <button 
                                    onClick={() => setIsEditProfileOpen(true)}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-bold transition-colors border border-gray-200"
                                >
                                    <User className="h-4 w-4" /> Edit Profile
                                </button>
                                <button 
                                    onClick={() => setIsSecurityOpen(true)}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors shadow-sm"
                                >
                                    <Shield className="h-4 w-4" /> Security & OTP
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* right column*/}
                    <div className="md:col-span-2 space-y-6">
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
                                <div className="h-12 w-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-3">
                                    <CheckCircle className="h-6 w-6" />
                                </div>
                                <h3 className="text-3xl font-black text-gray-900">{clearedTasksCount}</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Tasks Cleared</p>
                            </div>

                            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
                                <div className="h-12 w-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-3">
                                    <Target className="h-6 w-6" />
                                </div>
                                <h3 className="text-3xl font-black text-gray-900">{activeTasksCount}</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Currently Active</p>
                            </div>

                            <div className="bg-gradient-to-br from-orange-400 to-red-500 p-5 rounded-3xl shadow-md flex flex-col justify-center items-center text-center transform hover:scale-105 transition-transform cursor-default">
                                <div className="h-12 w-12 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-3">
                                    <Flame className="h-6 w-6" />
                                </div>
                                <h3 className="text-3xl font-black text-white">{currentStreak} <span className="text-lg">Days</span></h3>
                                <p className="text-xs font-bold text-white/80 uppercase tracking-wider mt-1">Current Streak</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                Behavioral Insights <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full">BETA</span>
                            </h3>
                            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center h-48">
                                <p className="text-gray-400 font-medium mb-2">Analyzing your workflow patterns...</p>
                                <p className="text-sm text-gray-400">Your emotion-aware companion will appear here once enough data is gathered.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}