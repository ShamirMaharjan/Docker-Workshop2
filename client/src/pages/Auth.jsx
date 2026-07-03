import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ChevronRight } from 'lucide-react';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    // Fixed: 'emal' typo to 'email' to prevent the uncontrolled input error
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login, register, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register(formData.name, formData.email, formData.password);
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
                
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-black text-gray-900 mb-2">
                        {isLogin ? 'Welcome Back' : 'Create an Account'}
                    </h2>
                    <p className="text-gray-500 text-sm">
                        {isLogin ? 'Log in to manage your tasks.' : 'Join to start organizing your tasks.'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-semibold mb-6 border border-red-100 text-center">
                        {error}
                    </div>
                )}

                <div className="mb-6 flex justify-center w-full">
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            try {
                                await googleLogin(credentialResponse.credential);
                                navigate('/dashboard');
                            } catch (err) {
                                setError('Google authentication failed. Please try again.', err);
                            }
                        }}
                        onError={() => {
                            setError('Google authentication failed. Please try again.');
                        }}
                        theme="outline"
                        size="large"
                        width="100%"
                        text={isLogin ? "signin_with" : "signup_with"}
                    />
                </div>

                <div className="relative flex py-2 items-center mb-6">
                    <div className="flex grow border-t border-gray-200"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-bold uppercase tracking-wider">Or</span>
                    <div className="flex grow border-t border-gray-200"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-gray-900"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required={!isLogin}
                            />
                        </div>
                    )}
                    
                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-gray-900"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    
                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-gray-900"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md mt-2 disabled:bg-gray-400"
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Continue')} <ChevronRight className="h-5 w-5" />
                    </button>
                </form>

                {/* Fixed: Replaced the outer <button> wrapper with a <p> tag */}
                <p className="text-center mt-8 text-sm text-gray-500">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        type="button"
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                        className="text-blue-600 font-bold hover:underline focus:outline-none"
                    >
                        {isLogin ? 'Sign up' : 'Log in'}
                    </button>
                </p>
                
            </div>
        </div>
    );
}