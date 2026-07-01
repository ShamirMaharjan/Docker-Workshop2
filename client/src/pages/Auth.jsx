import { useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', emal: '', password: '' });
    const [error, setError] = useState('');
    const { login, register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register(formData.name, formData.email, formData.password);
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <di className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-amber-500 mb-6 text-center">
                    {isLogin ? 'Welcome Back' : 'Join the ToDo'}
                </h2>

                {error && <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-sm text-center">{error}</div>}

                <Form onSubmit={handleSubmit} className="space-y-4">
                    {isLogin && (
                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full bg-slate-700 text-white p-3 rounded focus:outline-none focus:ring2 focus:ring-amber-500"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full bg-slate-700 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full bg-slate-700 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />

                    <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold p-3 rounded transition-colors">
                        {isLogin ? 'Sign up' : 'Create Account'}
                    </button>
                </Form>

                <button type="submit" className="mt-6 text-center text-slate-400 text-sm">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-amber-500 hober-underline focus-outline-none"
                    >
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </button>
            </di>
        </div>
    );
}