import express from 'express';
import { createUser, getUserById, getUser, loginUser, updateUser } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// POST USER (registration)
router.post('/register', createUser);
// GET USER route (by id, no auth)
router.get('/users/:id', getUserById);
// user login
router.post('/login', loginUser);
// GET user (authentication)
router.get('/me', authMiddleware, getUser);
//PUT user (authentication)
router.put('/me', authMiddleware, updateUser);

export default router;