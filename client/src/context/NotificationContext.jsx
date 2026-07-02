import { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({ message: '', type: '', visible: false });

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type, visible: true });

        setTimeout(() => {
            setNotification((prev) => ({ ...prev, visible: false }));
        }, 3000);
    };

    const hideNotification = () => {
        setNotification((prev) => ({ ...prev, visible: false }));
    };

    return (
        <NotificationContext.Provider value={{ notification, showNotification, hideNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};