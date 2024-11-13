import { get } from 'mongoose';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Task from '../models/Task.js';

// create Team (POST)
const createTeam = async (req, res) => {
    try {
        console.log(req.user);
        const { name, description } = req.body;
        const newTeam = new Team({
            name,
            description,
            members: [req.user._id],
            createdAt: new Date(),
            updatedAt: new Date(),
            creator: req.user._id
        });

        await newTeam.save();
        res.status(201).json(newTeam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// view Team (GET)
const getTeam = async (req, res) => {
    try {
        const teamId = req.params.id;
        const userId = req.user._id;
        const team = await Team.findById(teamId).populate('members', 'username email').populate('tasks');

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        const isMember = team.members.some(member => member._id.toString() === userId);
        if (!isMember) {
            return res.status(403).json({ message: 'Access denied. You are not a member of this team' });
        }

        res.status(200).json({
            name: team.name,
            description: team.description,
            members: team.members,
            tasks: team.tasks,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// edit Team (PUT)
const editTeam = async (req, res) => {
    try {
        const { name, description } = req.body;
        const team = await Team.findById(req.params.id);
    
        if (team.creator.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'Not authorized to edit this team' });
        }
    
        team.name = name || team.name;
        team.description = description || team.description;
        team.updatedAt = new Date();
    
        await team.save();
        res.status(200).json(team);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
};

// add member to Team (PUT)
const addMember = async (req, res) => {
    try {
        const { username } = req.body;
        const team = await Team.findById(req.params.id);
    
        if (team.creator.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'Not authorized to add members to this team' });
        }
    
        const userToAdd = await User.findOne({ username });
        if (!userToAdd) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        if (team.members.includes(userToAdd._id)) {
          return res.status(400).json({ message: 'User is already a member' });
        }
    
        team.members.push(userToAdd._id);
        await team.save();
        res.status(200).json(team);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
};

// remove member from Team (PUT)
const removeMember = async (req, res) => {
    try {
        const { username } = req.body;
        const team = await Team.findById(req.params.id);
    
        if (team.creator.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'Not authorized to remove members from this team' });
        }
    
        const userToRemove = await User.findOne({ username });
        if (!userToRemove) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        if (!team.members.includes(userToRemove._id)) {
          return res.status(400).json({ message: 'User is not a member of the team' });
        }
    
        team.members.pull(userToRemove._id);
        await team.save();
        res.status(200).json(team);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
};

// delete Team (DELETE)
const deleteTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
    
        // Check if user is the creator of the team
        if (team.creator.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'Not authorized to delete this team' });
        }
    
        // Delete all tasks associated with the team
        await Task.deleteMany({ teamId: team._id });
        
        // Delete the team
        await Team.findByIdAndDelete(req.params.id);
        res.status(204).send();
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
};

export { createTeam, getTeam, editTeam, addMember, removeMember, deleteTeam };