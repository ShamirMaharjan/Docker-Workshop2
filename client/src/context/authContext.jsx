import { createContext, useState, useEffect } from 'react';
import axios from 'axios';


export const AuthContext = createContext();

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // Include cookies in requests
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('todo_user');
        if (storedUser) setUser(JSON.parse(storedUser));
        setLoading(false);
    }, []);

    const login = async (email, password, turnstileToken) => {
        const res = await api.post('/auth/login', { email, password, turnstileToken });
        setUser(res.data.user);
        localStorage.setItem('todo_user', JSON.stringify(res.data.user));
    };

    const register = async (name, email, password, turnstileToken) => {
        const res = await api.post('/auth/register', { name, email, password, turnstileToken });
        setUser(res.data.user);
        localStorage.setItem('todo_user', JSON.stringify(res.data.user));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('todo_user');
    };

    const updateUser = (updatedUserData) => {
        setUser(updatedUserData);
        localStorage.setItem('todo_user', JSON.stringify(updatedUserData));
    };

    const googleLogin = async (credential) => {
        const res = await api.post('/auth/google', { credential });
        setUser(res.data.user);
        localStorage.setItem('todo_user', JSON.stringify(res.data.user));
    };

    const requestPasswordReset = async (email) => {
        await api.post('/auth/forgot-password', { email });
    };

    const confirmPasswordReset = async (email, otp, newPassword) => {
        await api.post('/auth/reset-password', { email, otp, newPassword })
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser, googleLogin, requestPasswordReset, confirmPasswordReset }}>
            {children}
        </AuthContext.Provider>
    );
};