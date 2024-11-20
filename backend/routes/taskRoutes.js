import express from 'express';
import { createTask, getTask, updateTask, deleteTask } from '../controllers/taskController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new task
router.post('/tasks', authMiddleware, createTask);
// Get a specific task by ID
router.get('/tasks/:id', authMiddleware, getTask);
// Update a specific task by ID
router.put('/tasks/:id', authMiddleware, updateTask);
// Delete a specific task by ID
router.delete('/tasks/:id', authMiddleware, deleteTask);


export default router;