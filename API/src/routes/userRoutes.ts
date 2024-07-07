import { Router } from 'express';
import { addUser, getUser, getUsers, validateUser, deleteUser, updateUserToBotanist } from '../controllers/userController';

const router = Router();

router.post('/add', addUser);
router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/login', validateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/botanist', updateUserToBotanist);

export default router;