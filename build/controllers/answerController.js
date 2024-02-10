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
exports.deleteAnswer = exports.editAnswer = exports.getAnswerById = exports.postAnswer = exports.getAllAnswers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllAnswers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allAnswers = yield prisma.answer.findMany();
    res.json(allAnswers);
});
exports.getAllAnswers = getAllAnswers;
const postAnswer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, questionId } = req.body;
    //@ts-ignore
    const user = req.user;
    try {
        const result = yield prisma.answer.create({
            data: {
                body,
                questionId,
                userId: user.id,
            },
        });
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ error: 'Unable to post the answer' });
    }
});
exports.postAnswer = postAnswer;
const getAnswerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const answer = yield prisma.answer.findUnique({
        where: { id: Number(id) },
    });
    if (!answer) {
        return res.status(404).json('answer not found');
    }
    res.json(answer);
});
exports.getAnswerById = getAnswerById;
const editAnswer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { body, questionId, userId } = req.body;
    try {
        const result = yield prisma.answer.update({
            where: { id: Number(id) },
            data: { body, questionId, userId },
        });
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ error: 'failed to update the answer' });
    }
});
exports.editAnswer = editAnswer;
const deleteAnswer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.answer.delete({ where: { id: Number(id) } });
        res.json({ message: 'answer deleted successfully' });
    }
    catch (error) {
        res.status(400).json({ error: 'unable to delete the answer' });
    }
});
exports.deleteAnswer = deleteAnswer;
