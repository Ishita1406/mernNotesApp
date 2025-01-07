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

let port = 8080;

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

app.use('/server/auth', userRouter);

app.use('/server/note', noteRouter);