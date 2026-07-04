import { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext';
import { useProfile } from '../hooks/useProfile';
import { useTasks } from '../hooks/useTasks';
import Navbar from '../components/Navbar';
import { Flame, CheckCircle, Target, User, ArrowLeft, X, Mail, Lock, ArrowRight, Settings, Shield, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProfileSkeleton from '../components/skelton/Profile';
import Companion from '../components/Companion';
import { AnimatePresence, motion } from 'framer-motion';

export default function Profile() {
    const { user, logout, updateUser } = useContext(AuthContext);
    const { tasks } = useTasks();
    const { profileData, loading, updateName, requestOTP, updateEmail, updatePassword, deleteAccount } = useProfile();

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [newName, setNewName] = useState(user?.name || '');
    
    const [securityStep, setSecurityStep] = useState(1);
    const [securityMode, setSecurityMode] = useState('none');
    const [newValue, setNewValue] = useState('');
    const [otp, setOtp] = useState('');
    const [isSendingOTP, setIsSendingOTP] = useState(false);

    const [isDestructOpen, setIsDestructOpen] = useState(false);
    const [destructInput, setDestructInput] = useState('');

    const activeTasksCount = tasks.filter(t => t.status === 'active').length;

    const handleNameSave = async (e) => {
        e.preventDefault();
        if (newName === user?.name) return;
        const updatedUser = await updateName(newName);
        if (updatedUser) {
            updateUser(updatedUser);
            closeSettings();
        }
    };

    const handleInitSecurityChange = async (mode) => {
        setSecurityMode(mode);
        setSecurityStep(2);
        setIsSendingOTP(true);
        await requestOTP();
        setIsSendingOTP(false);
    };

    const handleVerifyAndSave = async (e) => {
        e.preventDefault();
        let success = false;
        if (securityMode === 'email') success = await updateEmail(otp, newValue);
        else if (securityMode === 'password') success = await updatePassword(otp, newValue);

        if (success) {
            setSecurityStep(1);
            setSecurityMode('none');
            setNewValue('');
            setOtp('');
            closeSettings();
        }
    };

    const closeSettings = () => {
        setIsSettingsOpen(false);
        setTimeout(() => {
            setSecurityStep(1);
            setOtp('');
            setNewValue('');
        }, 300);
    };

    const handleSelfDestruct = async (e) => {
        e.preventDefault();
        if (destructInput !== user?.name) return; // failsafe
        
        const success = await deleteAccount();
        if (success) {
            logout();
        }
    };

    if (loading) { return <ProfileSkeleton />; }

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20 sm:pb-0">
            <Navbar />

            <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/dashboard" className="p-2 rounded-xl hover:bg-gray-50 transition-colors text-gray-500">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Profile</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10"></div>
                            
                            <div className="flex flex-col items-center text-center">
                                <div className="h-24 w-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-black mb-4 shadow-inner">
                                    {user?.name.charAt(0).toUpperCase()}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                                <p className="text-md text-gray-500 mb-6 truncate">{user?.email}</p>
                            </div>

                            <div className="space-y-3">
                                <button 
                                    onClick={() => { setIsSettingsOpen(true); setNewName(user?.name); }}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-sm"
                                >
                                    <Settings className="h-4 w-4" /> Account Settings
                                </button>
                                <button 
                                    onClick={logout}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
                                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-2 sm:mb-3">
                                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-black text-gray-900">{profileData.totalCleared}</h3>
                                <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Cleared</p>
                            </div>

                            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
                                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-2 sm:mb-3">
                                    <Target className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-black text-gray-900">{activeTasksCount}</h3>
                                <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Active</p>
                            </div>

                            <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-orange-400 to-red-500 p-4 sm:p-5 rounded-3xl shadow-md flex flex-col justify-center items-center text-center transform hover:scale-105 transition-transform cursor-default">
                                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-2 sm:mb-3">
                                    <Flame className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-black text-white">{profileData.streak} <span className="text-base sm:text-lg">Days</span></h3>
                                <p className="text-[10px] sm:text-xs font-bold text-white/80 uppercase tracking-wider mt-1">Streak</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                Behavioral Insights <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full">BETA</span>
                            </h3>
                            <Companion tasks={tasks} size="large" />
                        </div>
                    </div>
                </div>
            </main>

            {/*settings*/}
            <div className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0 pointer-events-none`}>
                <div className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isSettingsOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`} onClick={closeSettings} />

                <div className={`bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-6 relative overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-bottom md:origin-center ${isSettingsOpen ? 'scale-100 opacity-100 pointer-events-auto translate-y-0' : 'scale-95 opacity-0 translate-y-24 md:translate-y-0'}`}>
                    <button onClick={closeSettings} className="absolute top-5 right-5 p-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full text-gray-500 z-10">
                        <X className="h-4 w-4" />
                    </button>
                    
                    <h2 className="text-2xl font-black mb-6 text-gray-900">Account Settings</h2>

                    <div className="mb-6">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-wider">Display Name</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                                <input type="text" value={newName} onChange={e => setNewName(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-medium text-sm sm:text-base" />
                            </div>
                            <button onClick={handleNameSave} className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-5 rounded-xl font-bold transition-colors whitespace-nowrap text-sm sm:text-base">
                                Update
                            </button>
                        </div>
                    </div>

                    <hr className="border-gray-100 mb-6" />

                    <div className="mb-8">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-3 block tracking-wider">Security & Identity</label>
                        {securityStep === 1 ? (
                            <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-300">
                                <button onClick={() => handleInitSecurityChange('email')} className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:scale-110 transition-transform"><Mail className="h-5 w-5" /></div>
                                        <span className="font-bold text-gray-700 text-sm sm:text-base">Change Email Address</span>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
                                </button>
                                <button onClick={() => handleInitSecurityChange('password')} className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600 group-hover:scale-110 transition-transform"><Lock className="h-5 w-5" /></div>
                                        <span className="font-bold text-gray-700 text-sm sm:text-base">Change Password</span>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleVerifyAndSave} className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                                <div className="bg-blue-50/80 border border-blue-100 text-blue-700 p-4 rounded-xl text-xs sm:text-sm font-medium mb-4 flex gap-3 items-start transition-all">
                                    {isSendingOTP ? (
                                        <div className="flex gap-3 items-center">
                                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0"></div>
                                            <p>Sending secure code...</p>
                                        </div>
                                    ) : (
                                        <><Shield className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5" /><p>OTP sent to your email.</p></>
                                    )}
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 block">Verification Code</label>
                                    <input type="text" placeholder="• • • • • •" value={otp} maxLength={6} onChange={e => setOtp(e.target.value)} className="w-full px-4 py-3 mt-1 bg-white border border-gray-200 shadow-sm rounded-xl outline-none focus:border-blue-500 text-center font-black tracking-[0.5em] text-xl" required />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 block">New {securityMode === 'email' ? 'Email Address' : 'Password'}</label>
                                    <div className="relative mt-1">
                                        {securityMode === 'email' ? <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" /> : <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />}
                                        <input type={securityMode === 'email' ? 'email' : 'password'} placeholder={`Enter your new ${securityMode}...`} value={newValue} onChange={e => setNewValue(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 shadow-sm rounded-xl outline-none focus:border-blue-500 font-medium text-sm sm:text-base" required />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => { setSecurityStep(1); setOtp(''); setNewValue(''); }} className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors text-sm sm:text-base">Back</button>
                                    <button type="submit" className="flex-[2] bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-md text-sm sm:text-base">Verify & Save</button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/*self destruct trigger*/}
                    <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center justify-between">
                        <div>
                            <h4 className="font-bold text-red-900 text-sm">Danger Zone</h4>
                            <p className="text-xs text-red-600 mt-0.5">Permanently delete account.</p>
                        </div>
                        <button onClick={() => { setIsSettingsOpen(false); setIsDestructOpen(true); }} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {/*self destruction*/}
            <AnimatePresence>
                {isDestructOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-red-950/80 backdrop-blur-sm" onClick={() => { setIsDestructOpen(false); setDestructInput(''); }} />
                        
                        <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }} className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-2xl relative z-10 w-full max-w-md border border-red-100">
                            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <AlertTriangle className="h-8 w-8" />
                            </div>
                            
                            <h2 className="text-2xl font-black text-center text-gray-900 mb-2">Initiate Self-Destruct?</h2>
                            <p className="text-gray-500 text-center text-sm mb-6">
                                This will permanently erase your tasks, behavioral data, and credentials. This action cannot be undone.
                            </p>

                            <form onSubmit={handleSelfDestruct}>
                                <label className="text-xs font-bold text-gray-500 tracking-wider mb-2 block text-center">
                                    TYPE <span className="text-red-600 select-all">{user?.name}</span> TO CONFIRM
                                </label>
                                <input 
                                    type="text" 
                                    value={destructInput} 
                                    onChange={(e) => setDestructInput(e.target.value)}
                                    placeholder={user.name}
                                    className="w-full text-center py-3 bg-red-50 border border-red-200 rounded-xl outline-none focus:border-red-500 font-bold text-gray-900 mb-6"
                                    required
                                />
                                
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => { setIsDestructOpen(false); setDestructInput(''); }} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl transition-colors">
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={destructInput !== user?.name}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-colors disabled:bg-red-300 disabled:cursor-not-allowed shadow-md"
                                    >
                                        Erase Data
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}