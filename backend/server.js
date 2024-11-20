import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './db.js';
import userRoutes from './routes/userRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
// import taskRoutes from './routes/taskRoutes.js';

dotenv.config();
const app = express();
const port = 4000;

// middleware to parse json
app.use(express.json());

// connect to mongodb
connectDB();

// user routes
app.use('/api', userRoutes);
// team routes
app.use('/api', teamRoutes);
// task routes
app.use('/api', taskRoutes);

// home route
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Serve the frontend application for all other routes
/*
app.get('*', (req, res) => {
    res.sendFile(path.resolve('dist', 'index.html'));
  });
*/

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});