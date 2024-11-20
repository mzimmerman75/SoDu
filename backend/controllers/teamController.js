import { get } from 'mongoose';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Task from '../models/Task.js';

// create Team (POST)
const createTeam = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newTeam = new Team({
            name,
            description,
            members: [req.user._id],
            createdAt: new Date(),
            updatedAt: new Date(),
            creator: req.user._id
        });

        // Save the team
        await newTeam.save();

        // Add team reference to the creator's user model
        await User.findByIdAndUpdate(
            req.user._id,
            { $push: { teams: newTeam._id } }, // Add the new team's ID to the user's teams array
            { new: true }
        );

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

        // add user to team
        team.members.push(userToAdd._id);
        await team.save();

        // add team reference to user
        await User.findByIdAndUpdate(
            userToAdd._id,
            { $push: { teams: team._id } },
            { new: true }
        );

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

        // remove team reference from user
        team.members.pull(userToRemove._id);
        await team.save();

        // remove team reference from user
        await User.findByIdAndUpdate(
            userToRemove._id,
            { $pull: { teams: team._id } },
            { new: true }
        );

        res.status(200).json(team);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        if (team.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this team' });
        }
        // delete all tasks related to team
        const tasksToDelete = await Task.find({ teamId: team._id });

        // remove task references from users
        for (let task of tasksToDelete) {
            // Remove task reference from users
            await User.updateMany(
                { _id: task.userId },
                { $pull: { tasks: task._id } }
            );

            // remove task reference from team
            if (task.teamId) {
                await Team.updateMany(
                    { _id: task.teamId },
                    { $pull: { tasks: task._id } }
                );
            }
            // delete tasks
            await Task.findByIdAndDelete(task._id);
        }

        // remove team reference from user
        await User.updateMany(
            { teams: team._id },
            { $pull: { teams: team._id } }
        );

        // finally delete the team
        await Team.findByIdAndDelete(req.params.id);

        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export { createTeam, getTeam, editTeam, addMember, removeMember, deleteTeam };