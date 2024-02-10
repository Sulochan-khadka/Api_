import { Router } from 'express';
import {
  deleteAnswer,
  editAnswer,
  getAllAnswers,
  getAnswerById,
  postAnswer,
} from '../controllers/answerController';
const router = Router();
router.get('/', getAllAnswers);
router.post('/', postAnswer);
router.get('/:id', getAnswerById);
router.put('/:id', editAnswer);
router.delete('/:id', deleteAnswer);

export default router;
