import { Router } from 'express';
import { getProfile, updateProfile, verifyUser, getUsers, getUserById, updateLocation } from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, authorize(['ADMIN']), getUsers);
router.get('/profile', authenticate, getProfile);
router.get('/:id', authenticate, getUserById); // Added for detail pages
router.post('/update-location', authenticate, updateLocation); // Real-time Tracking
router.put('/profile', authenticate, updateProfile);
router.put('/:id/verify', authenticate, authorize(['ADMIN']), verifyUser);

export default router;
