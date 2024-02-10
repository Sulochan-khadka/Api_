// import express from 'express';
import { Express } from 'express';
import questionRouter from './routes/questionRoutes';
import answerRouter from './routes/answerRoutes';
import userRouter from './routes/userRoutes';
import authRouter from './routes/authRoutes';
import { authenticateToken } from './middlewares/authMiddleware';
const express = require('express');
// import express from 'express';
const app: Express = express();
app.use(express.json());
app.set('trust proxy', true);

// app.get('/', (req, res) => {
//   // console.log('the request contains: ', req);
//   res.send('hello world');
// });
app.use('/user', authenticateToken, userRouter);
app.use('/question', authenticateToken, questionRouter);
app.use('/answer', authenticateToken, answerRouter);
app.use('/auth', authRouter);
app.use('/', (req, res) => {
  const ipAddress = req.ip;
  res.send(`Your IP address is ${ipAddress}`);
});
app.listen(3030, () => {
  console.log('server is listening');
});
