"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const questionRoutes_1 = __importDefault(require("./routes/questionRoutes"));
const answerRoutes_1 = __importDefault(require("./routes/answerRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
const express = require('express');
const app = express();
app.use(express.json());
app.set('trust proxy', true);
app.use('/user', authMiddleware_1.authenticateToken, userRoutes_1.default);
app.use('/question', authMiddleware_1.authenticateToken, questionRoutes_1.default);
app.use('/answer', authMiddleware_1.authenticateToken, answerRoutes_1.default);
app.use('/auth', authRoutes_1.default);
app.listen(3030, () => {
    console.log('server is listening');
});
