const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    status: {
        type: String,
        enum: ['backlog', 'focus', 'completed'],
        defaulkt: 'backlog',
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);