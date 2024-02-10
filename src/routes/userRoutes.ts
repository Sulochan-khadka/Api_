import { Router } from 'express';
import {
  createUser,
  deleteUser,
  editUserInfo,
  getAllUsers,
  getUserById,
} from '../controllers/userController';

const router = Router();
router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', editUserInfo);
router.delete('/:id', deleteUser);

export default router;
