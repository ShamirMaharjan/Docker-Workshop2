const Task = require('../models/task.model');

const getTasks = async (req, res) => {
    try {
        const tasks = (await Task.find({ userId: req.user._id })).toSorted({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching tasks. ", error });
    }
};

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

const updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true }
        );

        if (!task) return res.status(404).json({ message: "Task not found." });

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error while updating task. ", error });
    }
};

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