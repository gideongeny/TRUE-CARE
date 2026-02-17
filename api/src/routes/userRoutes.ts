import { Router } from 'express';
import { getProfile, updateProfile, verifyUser, getUsers } from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, authorize(['ADMIN']), getUsers);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/:id/verify', authenticate, authorize(['ADMIN']), verifyUser);

export default router;
