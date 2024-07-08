import { Router } from 'express';
import { addProfilePicture, getProfilePicture, getMultipleProfilePictures, updateProfilePicture, resetProfilePicture } from '../controllers/profilePictureController';

const router = Router();

router.post('/:userId/add', addProfilePicture);
router.get('/:userId', getProfilePicture);
router.post('/multiple', getMultipleProfilePictures);
router.patch('/:userId/update', updateProfilePicture);
router.delete('/:userId/reset', resetProfilePicture);

export default router;
