import { Router } from 'express';
import { initiateStkPush, mpesaCallback, getPaymentStatus, getPaymentHistory } from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/stk-push', authenticate, initiateStkPush);
router.post('/callback', mpesaCallback);
router.get('/status/:id', authenticate, getPaymentStatus);
router.get('/history', authenticate, getPaymentHistory);

export default router;
