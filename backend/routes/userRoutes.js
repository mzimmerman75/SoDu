import express from 'express';
import { createUser } from '../controllers/userController.js';

const router = express.Router();

// NEW USER route
router.post('/users', createUser);

export default router;
