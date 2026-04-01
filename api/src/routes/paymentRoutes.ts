import { Router } from 'express';
import { 
    initiateStkPush, 
    mpesaCallback, 
    getPaymentStatus, 
    getPaymentHistory,
    adminInitiateStkPushForUser 
} from '../controllers/paymentController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/stk-push', authenticate, initiateStkPush);
router.post('/admin/stk-push', authenticate, authorize(['ADMIN']), adminInitiateStkPushForUser);
router.post('/callback', mpesaCallback);
router.get('/status/:id', authenticate, getPaymentStatus);
router.get('/history', authenticate, getPaymentHistory);

export default router;
