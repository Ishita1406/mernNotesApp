import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import noteRouter from './routes/note.route.js';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());

app.use(
    cors({
        origin: 'https://mernnotesapp-a1i1.onrender.com'
    })
);

const _dirname = path.resolve();

app.use('/server/auth', userRouter);

app.use('/server/note', noteRouter);

app.use(express.static(path.join(_dirname, '/client/dist')));
app.get('*', (_, res) => {
    res.sendFile(path.join(_dirname, 'client', 'dist', 'index.html'));
});

let port = 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log(error);
    });