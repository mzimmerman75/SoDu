import express from 'express';
import {
  createTeam,
  getTeam,
  editTeam,
  addMember,
  removeMember,
  deleteTeam
} from '../controllers/teamController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// POST team
router.post('/teams', authMiddleware, createTeam);
// GET team
router.get('/teams/:id', authMiddleware, getTeam);
// PUT team
router.put('/teams/:id', authMiddleware, editTeam);
// add member to team (PUT)
router.put('/teams/:id/add-member', authMiddleware, addMember);
// remove member from team (PUT)
router.put('/teams/:id/remove-member', authMiddleware, removeMember);
// DELETE team
router.delete('/teams/:id', authMiddleware, deleteTeam);

export default router;