import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who created the task
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }, // Reference to the team (optional)
  isProject: { type: Boolean, default: false }, // Boolean to indicate if this is a project with subtasks
  subtasks: [{ 
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, default: 'Pending' },
    dueDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }], // array of subtasks, if isProject==true
  status: { type: String, default: 'Pending' },
  priority: { type: String, default: 'Medium' },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);

export default Task;