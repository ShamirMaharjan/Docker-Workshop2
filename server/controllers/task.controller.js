const Task = require('../models/task.model');

// get all tasks for a user
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching tasks. ", error });
    }
};

// create a new task
const createTask = async (req, res) => {
    try {
        const { title, description, dueDate, status, priority } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Task title is required." });
        }

        const task = await Task.create({
            userId: req.user._id,
            title,
            description,
            dueDate,
            priority
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error while creating task. ", error });
    }
};

// update a task
const updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { returnDocument: 'after' }
        );

        if (!task) return res.status(404).json({ message: "Task not found." });

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error while updating task. ", error });
    }
};

// delete a task
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

        if (!task) return res.status(404).json({ message: "Task not found." });

        res.status(200).json({ message: "Task deleted successfully.", id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: "Server error while deleting task. ", error });
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask
};