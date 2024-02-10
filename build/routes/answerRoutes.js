"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const answerController_1 = require("../controllers/answerController");
const router = (0, express_1.Router)();
router.get('/', answerController_1.getAllAnswers);
router.post('/', answerController_1.postAnswer);
router.get('/:id', answerController_1.getAnswerById);
router.put('/:id', answerController_1.editAnswer);
router.delete('/:id', answerController_1.deleteAnswer);
exports.default = router;