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
exports.deleteUser = exports.editUserInfo = exports.getUserById = exports.getAllUsers = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, name, type } = req.body;
    try {
        const result = yield prisma.user.create({
            data: {
                email,
                name,
                username,
                type,
                bio: 'Newbie here',
            },
        });
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ error: 'Username or email must be unique' });
    }
});
exports.createUser = createUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allUser = yield prisma.user.findMany();
    res.json(allUser);
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield prisma.user.findUnique({
        where: { id: Number(id) },
        include: { questions: true, answers: true },
    });
    if (!user) {
        return res.status(404).json('user not found');
    }
    res.json(user);
});
exports.getUserById = getUserById;
const editUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { bio, name, image } = req.body;
    try {
        const result = yield prisma.user.update({
            where: { id: Number(id) },
            data: { bio, name, image },
        });
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ error: 'failed to update the user' });
    }
});
exports.editUserInfo = editUserInfo;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.user.delete({ where: { id: Number(id) } });
        res.json({ message: 'user deleted successfully' });
    }
    catch (error) {
        res.status(400).json({ error: 'unable to delete the user' });
    }
});
exports.deleteUser = deleteUser;
