import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who created the team
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // List of users in the team
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }], // List of tasks under the team
    createdAt: { type: Date, default: Date.now }
  });

const Team = mongoose.model('Team', teamSchema);

export default Team;