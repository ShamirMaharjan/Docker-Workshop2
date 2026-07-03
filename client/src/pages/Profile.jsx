import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useTasks } from '../hooks/useTasks';
import Navbar from '../components/Navbar';
import { Flame, CheckCircle, Target, User, ArrowLeft, X, Mail, Lock, ArrowRight, Settings, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
    const { user, logout, updateUser } = useContext(AuthContext);
    const { tasks } = useTasks();
    const { profileData, loading, updateName, requestOTP, updateEmail, updatePassword } = useProfile();

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [newName, setNewName] = useState(user?.name || '');
    
    const [securityStep, setSecurityStep] = useState(1); // 1: menu, 2: OTP and new value input
    const [securityMode, setSecurityMode] = useState('none'); // 'email' or 'password'
    const [newValue, setNewValue] = useState('');
    const [otp, setOtp] = useState('');
    const [isSendingOTP, setIsSendingOTP] = useState(false);

    const activeTasksCount = tasks.filter(t => t.status === 'active').length;

    const handleNameSave = async (e) => {
        e.preventDefault();
        if (newName === user?.name) return;
        
        const updatedUser = await updateName(newName);
        if (updatedUser) {
            updateUser(updatedUser);
            setIsSettingsOpen(false);
        }
    };

    // trigger OTP and move to next step
    const handleInitSecurityChange = async (mode) => {
        setSecurityMode(mode);
        setSecurityStep(2);
        setIsSendingOTP(true);
        
        await requestOTP();

        setIsSendingOTP(false);
    };

    // verify OTP and save new credentials
    const handleVerifyAndSave = async (e) => {
        e.preventDefault();
        let success = false;

        if (securityMode === 'email') {
            success = await updateEmail(otp, newValue);
        } else if (securityMode === 'password') {
            success = await updatePassword(otp, newValue);
        }

        if (success) {
            setSecurityStep(1);
            setSecurityMode('none');
            setNewValue('');
            setOtp('');
            setIsSettingsOpen(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-gray-50 flex justify-center items-center font-bold text-blue-600">Loading profile...</div>

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
                            
                            <div className="h-20 w-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-black mb-4 shadow-inner">
                                {user?.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                            <p className="text-sm text-gray-500 mb-6">{user?.email}</p>

                            <div className="space-y-3">
                                <button 
                                    onClick={() => { setIsSettingsOpen(true); setNewName(user?.name); }}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-sm"
                                >
                                    <Settings className="h-4 w-4" /> Profile Settings
                                </button>
                                <button 
                                    onClick={logout}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold transition-all"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    {/*right column*/}
                    <div className="md:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
                                <div className="h-12 w-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-3">
                                    <CheckCircle className="h-6 w-6" />
                                </div>
                                <h3 className="text-3xl font-black text-gray-900">{profileData.totalCleared}</h3>
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
                                <h3 className="text-3xl font-black text-white">{profileData.streak} <span className="text-lg">Days</span></h3>
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

            {isSettingsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 relative overflow-hidden">
                        
                        <button 
                            onClick={() => { setIsSettingsOpen(false); setSecurityStep(1); setOtp(''); setNewValue(''); }} 
                            className="absolute top-5 right-5 p-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full text-gray-500 z-10"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        
                        <h2 className="text-2xl font-black mb-6 text-gray-900">Profile Settings</h2>
+
                        <div className="mb-6">
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-wider">Display Name</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={e => setNewName(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-medium"
                                    />
                                </div>
                                <button 
                                    onClick={handleNameSave} 
                                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-5 rounded-xl font-bold transition-colors whitespace-nowrap"
                                >
                                    Update
                                </button>
                            </div>
                        </div>

                        <hr className="border-gray-100 mb-6" />

                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase mb-3 block tracking-wider">Security & Identity</label>

                            {securityStep === 1 ? (
                                /*select what to change*/
                                <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-300">
                                    <button 
                                        onClick={() => handleInitSecurityChange('email')} 
                                        className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:scale-110 transition-transform"><Mail className="h-5 w-5" /></div>
                                            <span className="font-bold text-gray-700">Change Email Address</span>
                                        </div>
                                        <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
                                    </button>

                                    <button 
                                        onClick={() => handleInitSecurityChange('password')} 
                                        className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600 group-hover:scale-110 transition-transform"><Lock className="h-5 w-5" /></div>
                                            <span className="font-bold text-gray-700">Change Password</span>
                                        </div>
                                        <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
                                    </button>
                                </div>
                            ) : (
                                /*verify and enter new value*/
                                <form onSubmit={handleVerifyAndSave} className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                                    <div className="bg-blue-50/80 border border-blue-100 text-blue-700 p-4 rounded-xl text-sm font-medium mb-4 flex gap-3 items-start transition-all">
                                        {isSendingOTP ? (
                                            <div className="flex gap-3 items-center">
                                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0"></div>
                                                <p>Sending secure code to your email...</p>
                                            </div>
                                        ) : (
                                            <>
                                                <Shield className="h-5 w-5 shrink-0 mt-0.5" />
                                                <p>OTP sent! Enter the 6-digit code sent to your current email to authorize this change.</p>
                                            </>
                                        )}
                                    </div>

                                    {/*OTP input*/}
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 block">Verification Code</label>
                                        <input
                                            type="text"
                                            placeholder="• • • • • •"
                                            value={otp}
                                            maxLength={6}
                                            onChange={e => setOtp(e.target.value)}
                                            className="w-full px-4 py-3 mt-1 bg-white border border-gray-200 shadow-sm rounded-xl outline-none focus:border-blue-500 text-center font-black tracking-[0.5em] text-xl"
                                            required
                                        />
                                    </div>

                                    {/*new value input*/}
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 block">
                                            New {securityMode === 'email' ? 'Email Address' : 'Password'}
                                        </label>
                                        <div className="relative mt-1">
                                            {securityMode === 'email' ? <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" /> : <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />}
                                            <input
                                                type={securityMode === 'email' ? 'email' : 'password'}
                                                placeholder={`Enter your new ${securityMode}...`}
                                                value={newValue}
                                                onChange={e => setNewValue(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 shadow-sm rounded-xl outline-none focus:border-blue-500 font-medium"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button 
                                            type="button" 
                                            onClick={() => { setSecurityStep(1); setOtp(''); setNewValue(''); }} 
                                            className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors"
                                        >
                                            Back
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="flex-[2] bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-md"
                                        >
                                            Verify & Save
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}