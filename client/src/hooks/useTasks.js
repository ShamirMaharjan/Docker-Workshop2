import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true 
});

export const useTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (error) {
            showNotification('Failed to load tasks', 'error', error);
        } finally {
            setLoading(false);
        }
    };

    // run fetch on mount
    useEffect(() => {
        fetchTasks();
    }, []);

    // POST: Add a new task
    const addTask = async (title, description, priority = 'medium') => {
        try {
            const res = await api.post('/tasks', { title, description, priority });
            setTasks([res.data, ...tasks]); // Add new task to the top of the state
            showNotification('Task stashed successfully!', 'success');
            return true;
        } catch (error) {
            showNotification(error.response?.data?.message || 'Failed to add task', 'error');
            return false;
        }
    };

    const updateStatus = async (taskId, newStatus) => {
        // Optimistic UI update (feels instant to the user)
        const previousTasks = [...tasks];
        setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));

        try {
            await api.put(`/tasks/${taskId}`, { status: newStatus });
        } catch (error) {
            setTasks(previousTasks);
            showNotification('Failed to update task', 'error', error);
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await api.delete(`/tasks/${taskId}`);
            setTasks(tasks.filter(t => t._id !== taskId));
            showNotification('Task deleted', 'success');
        } catch (error) {
            showNotification('Failed to delete task', 'error', error);
        }
    };

    return {
        tasks,
        loading,
        addTask,
        updateStatus,
        deleteTask
    };
};