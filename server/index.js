import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import noteRouter from './routes/note.route.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use(
    cors({
        origin: '*'
    })
);

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log(error);
    });

app.use('/server/auth', userRouter);

app.use('/server/note', noteRouter);