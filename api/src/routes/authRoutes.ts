import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { setup2FA, verifyAndEnable2FA, disable2FA } from '../controllers/2faController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);

router.get('/2fa/setup', authenticate, setup2FA);
router.post('/2fa/verify', authenticate, verifyAndEnable2FA);
router.post('/2fa/disable', authenticate, disable2FA);

export default router;
