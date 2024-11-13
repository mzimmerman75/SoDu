import Task from '../models/Task.js';
import Team from '../models/Team.js';
import User from '..models/User.js';

// Create Task (POST)
const createTask = async (req, res) => {
    const { title, description, teamId, isProject, subtasks, status, priority, dueDate } = req.body;

    try {
        const newTask = new Task({
            title,
            description,
            userId: req.user._id,
            teamId,
            isProject,
            subtasks,
            status,
            priority,
            dueDate
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export default createTask;


export { createTask };