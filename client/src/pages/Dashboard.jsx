import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-amber-500">
                    Dashboard
                </h1>
                <div className="flex items-center gap-4">
                    <span>Welcome, {user?.name}</span>
                    <button onClick={handleLogout} className="bg-slate-700 px-4 py-2 rounded hover:bg-slate600 transition">
                        Logout
                    </button>
                </div>
            </div>
            
            <div className="border-2 border-dahsed border-slate-700 rounded-xl h-64 flex items-center justify-center text-slate-500">
                Task coming soon...
            </div>
        </div>
    );
}