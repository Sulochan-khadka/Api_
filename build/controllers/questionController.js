"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuestion = exports.questionById = exports.askQuestion = exports.getAllQuestions = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allQuestions = yield prisma.question.findMany();
    res.json(allQuestions);
});
exports.getAllQuestions = getAllQuestions;
const askQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, type } = req.body;
    //@ts-ignore
    const user = req.user;
    try {
        const result = yield prisma.question.create({
            data: {
                title,
                description,
                type,
                userId: user.id,
            },
        });
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ error: 'Unable to post the question' });
    }
});
exports.askQuestion = askQuestion;
const questionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const question = yield prisma.question.findUnique({
        where: { id: Number(id) },
        include: { answers: true },
    });
    if (!question) {
        return res.status(404).json('question not found');
    }
    res.json(question);
});
exports.questionById = questionById;
const deleteQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.question.delete({ where: { id: Number(id) } });
        res.json({ message: 'question deleted successfully' });
    }
    catch (error) {
        res.status(400).json({ error: 'unable to delete the question' });
    }
});
exports.deleteQuestion = deleteQuestion;
