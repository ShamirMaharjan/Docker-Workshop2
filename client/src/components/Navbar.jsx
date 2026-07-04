import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { LayoutDashboard, LogOut, UserCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); 
    };

    return (
        <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-2 text-blue-600">
                <LayoutDashboard className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">ToDo</span>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-6">
                <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-50 px-2 sm:px-3 py-1.5 rounded-xl transition-colors group">
                    <UserCircle className="h-6 w-6 sm:h-5 sm:w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    <span className="text-sm font-medium text-gray-600 hidden sm:block">
                        <span className="text-gray-900 font-bold">{user?.name}</span>
                    </span>
                </Link>

                <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>
                
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-red-600 transition-colors p-1.5 sm:p-0"
                >
                    <LogOut className="h-5 w-5 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </nav>
    );
}