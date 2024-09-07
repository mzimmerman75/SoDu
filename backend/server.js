import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './db.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
const app = express();
const port = 4000;

// middleware to parse json
app.use(express.json());

// connect to mongodb
connectDB();

// first route for user
// app.use('/api', userRoutes);

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