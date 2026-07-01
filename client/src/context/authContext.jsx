import { createContext, useState, useEffect } from 'react';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

export const AuthContext = createContext();

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // Include cookies in requests
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('app_user');
        if (storedUser) setUser(JSON.parse(storedUser));
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        setUser(res.data.user);
        localStorage.setItem('app_user', JSON.stringify(res.data.user));
    };

    const register = async (name, email, password) => {
        const res = await api.post('/auth/register', { name, email, password });
        setUser(res.data.user);
        localStorage.setItem('app_user', JSON.stringify(res.data.user));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('app_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};