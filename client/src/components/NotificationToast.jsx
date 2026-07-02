import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export default function NotificationToast() {
    const { notification, hideNotification } = useNotification();

    if (!notification.visible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${notification.type === 'error'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                {notification.type === 'error' ? <AlertCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                <span className="font-semibold text-sm">{notification.message}</span>
                <button onClick={hideNotification} className="ml-2 hover:opacity-70">
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}