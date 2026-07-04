import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';
import { AuthContext } from '../context/authContext';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

export const useProfile = () => {
    const [profileData, setProfileData] = useState({ streak: 0, totalCleared: 0 });
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();
    const { user, login } = useContext(AuthContext);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/users/profile');
            setProfileData({ streak: res.data.streak, totalCleared: res.data.totalCleared });
        } catch (error) {
            showNotification('Failed to load profile stats', 'error', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const updateName = async (name) => {
        try {
            const res = await api.put('/users/profile/name', { name });
            showNotification('Name updated successfully', 'success');
            return res.data; // return updated user
        } catch (error) {
            showNotification('Failed to update name', 'error', error);
            return null;
        }
    };

    const requestOTP = async () => {
        try {
            await api.post('/users/profile/request-otp');
            showNotification('OTP sent to your email', 'success');
            return true;
        } catch (error) {
            showNotification('Failed to send OTP', 'error', error);
            return false;
        }
    };

    const updateEmail = async (otp, newEmail) => {
        try {
            const res = await api.put('/users/profile/email', { otp, newEmail });
            showNotification('Email updated successfully', 'success');
            return res.data;
        } catch (error) {
            showNotification(error.response?.data?.message || 'Failed to update email', 'error');
            return null;
        }
    };

    const updatePassword = async (otp, newPassword) => {
        try {
            await api.put('/users/profile/password', { otp, newPassword });
            showNotification('Password updated successfully', 'success');
            return true;
        } catch (error) {
            showNotification(error?.response?.data?.message || 'Failed to update password', 'error');
            return false;
        }
    };

    const deleteAccount = async () => {
        try {
            await api.delete('/users/profile');
            showNotification('Account permanently deleted', 'success');
            return true;
        } catch (error) {
            showNotification('Failed to delete account', 'error', error);
            return false;
        }
    };

    return {
        profileData,
        loading,
        updateName,
        requestOTP,
        updateEmail,
        updatePassword,
        deleteAccount,
    };
};