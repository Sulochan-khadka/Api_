import { Express } from 'express';
import questionRouter from './routes/questionRoutes';
import answerRouter from './routes/answerRoutes';
import userRouter from './routes/userRoutes';
import authRouter from './routes/authRoutes';
import { authenticateToken } from './middlewares/authMiddleware';
const express = require('express');
const app: Express = express();
app.use(express.json());
app.set('trust proxy', true);
app.use('/user', authenticateToken, userRouter);
app.use('/question', authenticateToken, questionRouter);
app.use('/answer', authenticateToken, answerRouter);
app.use('/auth', authRouter);

app.listen(3030, () => {
  console.log('server is listening');
});
