import { Router } from 'express';
<<<<<<< HEAD
import { getProfile, updateProfile, verifyUser, getUsers } from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, authorize(['ADMIN']), getUsers);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/:id/verify', authenticate, authorize(['ADMIN']), verifyUser);
=======
import { getProfile, updateProfile } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
>>>>>>> 19273b9096fa76d374989ee9afb141420f514580

export default router;
