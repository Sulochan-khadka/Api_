import { Router } from 'express';
import {
  askQuestion,
  deleteQuestion,
  getAllQuestions,
  questionById,
} from '../controllers/questionController';
const router = Router();
router.get('/', getAllQuestions);
router.post('/ask', askQuestion);
router.get('/:id', questionById);

router.delete('/:id', deleteQuestion);

export default router;
