import { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../context/authContext';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ChevronRight, Shield, X } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import { AnimatePresence, motion } from 'framer-motion';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState('');

    const turnstileRef = useRef(null);
    
    const { user, login, register, googleLogin, requestPasswordReset, confirmPasswordReset } = useContext(AuthContext);
    const navigate = useNavigate();

    const [isForgotOpen, setIsForgotOpen] = useState(false);
    const [forgotStep, setForgotStep] = useState(1);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotOtp, setForgotOtp] = useState('');
    const [forgotNewPassword, setForgotNewPassword] = useState('');
    const [forgotError, setForgotError] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (!turnstileToken) {
            setError('Please complete the security check.');
            return;
        }
        setLoading(true);
        try {
            if (isLogin) {
                await login(formData.email, formData.password, turnstileToken);
            } else {
                await register(formData.name, formData.email, formData.password, turnstileToken);
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Please try again.');
            setTurnstileToken('');
            turnstileRef.current?.reset(); // reset the turnstile widget
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = () => {
        setIsLogin(!isLogin);
        setError('');
        setSuccessMsg('');
        setFormData({ name: '', email: '', password: '' });
    };

    const handleForgotRequest = async (e) => {
        e.preventDefault();
        setForgotError('');
        setForgotLoading(true);
        try {
            await requestPasswordReset(forgotEmail);
            setForgotStep(2);
        } catch (err) {
            setForgotError(err.response?.data?.message || 'Failed to request reset.');
        } finally {
            setForgotLoading(false);
        }
    };

    const handleForgotConfirm = async (e) => {
        e.preventDefault();
        setForgotError('');
        setForgotLoading(true);
        try {
            await confirmPasswordReset(forgotEmail, forgotOtp, forgotNewPassword);
            setIsForgotOpen(false);
            setForgotStep(1);
            setForgotEmail('');
            setForgotOtp('');
            setForgotNewPassword('');
            setSuccessMsg('Password reset successful! Please log in with your new password.');
        } catch (err) {
            setForgotError(err.response?.data?.message || 'Failed to reset password.');
        } finally {
            setForgotLoading(false);
        }
    };

    // auto redirect users to dashboard if they already logged in
    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate])

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans overflow-hidden relative z-0">

            <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px] opacity-80 pointer-events-none"></div>
            <motion.div 
                animate={{ x: [0, 40, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} 
                className="absolute top-[-10%] right-[-10%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-blue-500/20 rounded-full blur-[100px] -z-10 pointer-events-none" 
            />
            
            {/* bottom left orb */}
            <motion.div 
                animate={{ x: [0, -40, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }} 
                className="absolute bottom-[-10%] left-[-10%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-cyan-400/20 rounded-full blur-[100px] -z-10 pointer-events-none" 
            />

            <div className="bg-white rounded-3xl shadow-2xl shadow-blue-900/10 w-full max-w-md border border-gray-100 overflow-hidden relative z-10">
                
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-semibold m-4 sm:mb-4 mb-0 border border-red-100 text-center animate-in fade-in">
                        {error}
                    </div>
                )}
                {successMsg && (
                    <div className="bg-green-50 text-green-600 p-3 rounded-xl text-sm font-semibold m-4 sm:mb-4 mb-0 border border-green-100 text-center animate-in fade-in">
                        {successMsg}
                    </div>
                )}

                {/*slider container*/}
                <div 
                    className="flex w-[200%] transition-transform duration-500 ease-in-out relative"
                    style={{ transform: isLogin ? 'translateX(0)' : 'translateX(-50%)' }}
                >
                    {/*login view left side*/}
                    <div className="w-1/2 shrink-0 px-6 sm:px-8 pt-6 sm:pt-6">
                        <div className="mb-5 sm:mb-8 text-center">
                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1 sm:mb-2">Welcome Back</h2>
                            <p className="text-gray-500 text-xs sm:text-sm">Log in to manage your tasks.</p>
                        </div>

                        <div className="mb-3 sm:mb-6 flex justify-center w-full">
                            <GoogleLogin
                                onSuccess={async (res) => {
                                    try { await googleLogin(res.credential); navigate('/dashboard'); } 
                                    catch (err) { setError('Google authentication failed.', err); }
                                }}
                                onError={() => setError('Google popup failed.')}
                                theme="outline"
                                size="large"
                                width="100%"
                                shape="pill"
                                text="signin_with"
                            />
                        </div>

                        <div className="relative flex py-2 items-center mb-3 sm:mb-6">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink-0 mx-2 sm:mx-4 text-gray-400 text-[10px] sm:text-sm font-bold uppercase tracking-wider">Or</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-4 top-4.5 sm:top-4 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all font-medium sm:text-md text-sm"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-4 sm:top-4 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all font-medium sm:text-md text-sm"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex justify-end mt-2">
                                <button type="button" onClick={() => setIsForgotOpen(true)} className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                                    Forgot Password?
                                </button>
                            </div>

                            {/*turnstile widget*/}
                            {isLogin && (
                                <div className="flex justify-center pt-2">
                                    <Turnstile
                                        ref={turnstileRef}
                                        siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                                        onSuccess={(token) => setTurnstileToken(token)}
                                    />
                                </div>
                            )}
                            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md mt-2 disabled:bg-gray-400">
                                {loading ? 'Processing...' : 'Log In'} <ChevronRight className="h-5 w-5" />
                            </button>
                        </form>
                    </div>

                    {/*register view right side*/}
                    <div className="w-1/2 shrink-0 px-8 pt-8">
                        <div className="mb-5 sm:mb-8  text-center">
                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1 sm:mb-2">Create Account</h2>
                            <p className="text-gray-500 text-xs sm:text-sm">Join to start organizing your tasks.</p>
                        </div>

                        <div className="mb-3 sm:mb-6 flex justify-center w-full">
                            <GoogleLogin
                                onSuccess={async (res) => {
                                    try { await googleLogin(res.credential); navigate('/dashboard'); } 
                                    catch (err) { setError('Google authentication failed.', err); }
                                }}
                                onError={() => setError('Google popup failed.')}
                                theme="outline"
                                size="large"
                                width="100%"
                                shape="pill"
                                text="signup_with"
                            />
                        </div>

                        <div className="relative flex py-2 items-center sm:mb-6 mb-3">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink-0 mx-2 sm:mx-4 text-gray-400 text-[10px] sm:text-sm font-bold uppercase tracking-wider">Or</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-4 top-4.5 sm:top-4 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all font-medium sm:text-md text-sm"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required={!isLogin}
                                />
                            </div>
                            <div className="relative">
                                <Mail className="absolute left-4 top-4 sm:top-4 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all font-medium sm:text-md text-sm"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required={!isLogin}
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-4 sm:top-4 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all font-medium sm:text-md text-sm"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required={!isLogin}
                                />
                            </div>

                            {/*turnstile widget*/}
                            {!isLogin && (
                                <div className="flex justify-center pt-2">
                                    <Turnstile
                                        ref={turnstileRef}
                                        siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                                        onSuccess={(token) => setTurnstileToken(token)}
                                    />
                                </div>
                            )}
                            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md mt-2 disabled:bg-gray-400">
                                {loading ? 'Processing...' : 'Continue'} <ChevronRight className="h-5 w-5" />
                            </button>
                        </form>
                    </div>
                </div>

                {/*static bottom toggle*/}
                <p className="text-center sm:mt-6 mt-3 text-sm text-gray-500 relative z-10 bg-white pb-4">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button type="button" onClick={handleToggle} className="text-blue-600 font-bold hover:underline focus:outline-none">
                        {isLogin ? 'Sign up' : 'Log in'}
                    </button>
                </p>
            </div>

            {/*forgot password*/}
            <AnimatePresence>
                {isForgotOpen && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm"
                            onClick={() => { setIsForgotOpen(false); setForgotStep(1); setForgotError(1); }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", duration: 0.5 }}
                            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-6 sm:p-8 relative z-10"
                        >
                            <button onClick={() => { setIsForgotOpen(false); setForgotStep(1); setForgotError(''); }} className="absolute top-5 right-5 py-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full text-gray-500">
                                <X className="h-4 w-4" />
                            </button>

                            <h2 className="text-2xl font-black mb-2 text-gray-900">{forgotStep === 1 ? 'Reset Password' : 'Secure Verification'}</h2>
                            <p className="text-gray-500 text-sm mb-6">
                                {forgotStep === 1 ? 'Enter your email address and we will send you a recovery code.' : `Enter the 6-digit code sent to ${forgotEmail} along with your new password.`}
                            </p>

                            {forgotError && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-semibold mb-6 border border-red-100 text-center">{forgotError}</div>}

                            {forgotStep === 1 ? (
                                <form onSubmit={handleForgotRequest} className="space-y-4">
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                                        <input type="email" placeholder="Email Address" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all font-medium" required />
                                    </div>
                                    <button type="submit" disabled={forgotLoading} className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-4 disabled:bg-gray-400">
                                        {forgotLoading ? 'Sending...' : 'Send Recovery Code'}
                                    </button>
                                </form>
                            ) : (
                                    <form onSubmit={handleForgotConfirm} className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-bold tetx-gray-400 uppercase ml-1 block">Verification Code</label>
                                            <input type="text" placeholder="• • • • • •" value={forgotOtp} maxLength={6} onChange={(e) => setForgotOtp(e.target.value)} className="w-full px-4 py-3 mt-1 bg-gray-50 border border-gray-200 shadow-sm rounded-xl outline-none text-center font-black tracking-[0.5em] text-xl" required />
                                        </div>
                                        <div className="mt-4">
                                            <label className="text-[10px] font-bold tetx-gray-400 uppercase ml-1 block">New Password</label>
                                            <div className="relative mt-1">
                                                <input type="password" placeholder="Enter new password" value={forgotNewPassword} onChange={(e) => setForgotNewPassword(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all font-medium" required />
                                            </div>
                                        </div>
                                        <button type="submit" disabled={forgotLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md mt-2 disabled:bg-gray-400">
                                            <Shield className="h-4 w-4" /> {forgotLoading ? 'Verifying...' : 'Reset & Confirm'}
                                        </button>
                                    </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}