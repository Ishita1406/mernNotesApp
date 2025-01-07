import express from 'express';
import { createUser, getUser, userLogin } from '../controllers/user.controller.js';
import { authenticateToken } from '../utils/authenticate.js';

const userRouter = express.Router();

userRouter.post('/signup', createUser);

userRouter.post('/login', userLogin);

userRouter.get('/get', authenticateToken, getUser);

export default userRouter;