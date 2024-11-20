import Task from '../models/Task.js';
import Team from '../models/Team.js';
import User from '../models/User.js';

// CREATE Task
const createTask = async (req, res) => {
    try {
      const { title, description, userId, teamId, isProject, subtasks, status, priority, dueDate } = req.body;
  
      const creatorId = userId || req.user._id;
  
      // Create the new task
      const newTask = new Task({
        title,
        description,
        userId: creatorId,
        teamId,
        isProject,
        subtasks,
        status,
        priority,
        dueDate
      });
  
      const savedTask = await newTask.save();
  
      // Add the task to the user's tasks array
      const user = await User.findById(creatorId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.tasks.push(savedTask._id);
      await user.save();
  
      // If the task is linked to a team, add it to the team's tasks array
      if (teamId) {
        const team = await Team.findById(teamId);
        if (!team) {
          return res.status(404).json({ message: 'Team not found' });
        }
  
        team.tasks.push(savedTask._id);
        await team.save();
      }
  
      res.status(201).json(savedTask);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

// READ Task (Single)
const getTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId).populate('userId', 'username email').populate('teamId', 'name description');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.userId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied. This task does not belong to you.' });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// UPDATE Task
const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const { title, description, status, priority, dueDate, subtasks } = req.body;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this task.' });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;
        task.priority = priority || task.priority;
        task.dueDate = dueDate || task.dueDate;
        task.subtasks = subtasks || task.subtasks;
        task.updatedAt = new Date();

        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE Task
const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this task.' });
        }

        // remove task reference from user
        await User.updateMany(
            { _id: task.userId },
            { $pull: { tasks: taskId } }
        );

        // remove task reference from team
        if (task.teamId) {
            await Team.updateMany(
                { _id: task.teamId },
                { $pull: { tasks: taskId } }
            );
        }

        // finally delete task
        await Task.findByIdAndDelete(taskId);

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export { createTask, getTask, updateTask, deleteTask };