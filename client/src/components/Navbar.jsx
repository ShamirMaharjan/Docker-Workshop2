import { useContext } from 'react';
import { AuthContext } from '../context/authContext'; // <-- Ensure 'authContext' matches your file name exactly!
import { LayoutDashboard, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); // Send them back to the login page
    };

    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-2 text-blue-600">
                <LayoutDashboard className="h-6 w-6" />
                <span className="text-xl font-black text-gray-900 tracking-tight">Pipeline</span>
            </div>
            
            <div className="flex items-center gap-6">
                <span className="text-sm font-medium text-gray-600 hidden sm:block">
                    Welcome back, <span className="text-gray-900 font-bold">{user?.name}</span>
                </span>
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-600 transition-colors"
                >
                    <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </nav>
    );
}