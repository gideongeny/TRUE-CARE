import { Router } from 'express';
import { getProfile, updateProfile, verifyUser, getUsers, getUserById } from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, authorize(['ADMIN']), getUsers);
router.get('/profile', authenticate, getProfile);
router.get('/:id', authenticate, getUserById); // Added for detail pages
router.put('/profile', authenticate, updateProfile);
router.put('/:id/verify', authenticate, authorize(['ADMIN']), verifyUser);

export default router;
