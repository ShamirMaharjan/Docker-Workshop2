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
    // POST: Add a new task
    const addTask = async (title, description, dueDate, priority = 'medium') => {
        try {
            const payload = { 
                title, 
                description, 
                priority,
                ...(dueDate ? { dueDate } : {}) 
            };

            const res = await api.post('/tasks', payload);
            setTasks([res.data, ...tasks]); 
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

    const editTask = async (taskId, title, description, dueDate, priority) => {
        try {
            const res = await api.put(`/tasks/${taskId}`, { title, description, dueDate, priority });
            setTasks(tasks.map(t => t._id === taskId ? res.data : t));
            showNotification('Task updated!', 'success');
            return true;
        } catch (error) {
            showNotification('Failed to update task', 'error', error);
            return false;
        }
    };

    return {
        tasks,
        loading,
        addTask,
        updateStatus,
        deleteTask,
        editTask
    };
};