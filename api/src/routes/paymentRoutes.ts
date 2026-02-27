import { Router } from 'express';
import { initiateStkPush, mpesaCallback, getPaymentStatus } from '../controllers/paymentController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/stk-push', authenticateToken, initiateStkPush);
router.post('/callback', mpesaCallback);
router.get('/status/:id', authenticateToken, getPaymentStatus);

export default router;
