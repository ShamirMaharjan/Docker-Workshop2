import { Link } from 'react-router-dom';
import Companion from './Companion';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
    // Feed the companion a fake task so he renders!
    const fakeTasks = [
        { status: 'active', title: "Find the missing page" }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center font-sans">
            <div className="bg-white border border-gray-100 p-8 sm:p-12 rounded-[3rem] shadow-xl max-w-md w-full">
                
                {/* Companion looks around */}
                <div className="mb-8">
                    <Companion tasks={fakeTasks} size="large" />
                </div>

                <h1 className="text-6xl font-black text-gray-900 mb-4">404</h1>
                <h2 className="text-xl font-bold text-gray-700 mb-2">Hmm... I can't find that page.</h2>
                <p className="text-gray-500 text-sm mb-8 font-medium">
                    It looks like you took a wrong turn, or this link is broken. Let's get you back to your workspace.
                </p>

                <Link to="/dashboard">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md">
                        <ArrowLeft className="h-5 w-5" /> Return to Dashboard
                    </button>
                </Link>
            </div>
        </div>
    );
}