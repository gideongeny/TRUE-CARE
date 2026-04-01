import { Router } from 'express';
import { getProfile, updateProfile, verifyUser, getUsers, getUserById, updateLocation, getNotifications, markNotificationRead } from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, authorize(['ADMIN']), getUsers);
router.get('/profile', authenticate, getProfile);
router.get('/:id', authenticate, getUserById); // Added for detail pages
router.post('/update-location', authenticate, updateLocation); // Real-time Tracking
router.put('/profile', authenticate, updateProfile);
router.put('/:id/verify', authenticate, authorize(['ADMIN']), verifyUser);

// Notifications (v2.0)
router.get('/meta/notifications', authenticate, getNotifications);
router.patch('/meta/notifications/:id/read', authenticate, markNotificationRead);

// Reviews (v3.0)
import { addReview, getReviews } from '../controllers/userController';
router.post('/reviews', authenticate, addReview);
router.get('/reviews/public', getReviews);

export default router;
