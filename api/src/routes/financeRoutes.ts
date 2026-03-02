import { Router } from 'express';
import { getWalletBalance, requestWithdrawal, getAdminPayoutQueue, approvePayout } from '../controllers/financeController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Wallet balance and history (Caregiver and Admin)
router.get('/wallet', authenticate, getWalletBalance);

// Caregiver requests withdrawal
router.post('/withdraw', authenticate, authorize(['CAREGIVER']), requestWithdrawal);

// Admin sees all pending payout requests
router.get('/payout-queue', authenticate, authorize(['ADMIN']), getAdminPayoutQueue);

// Admin approves a payout
router.post('/approve-payout/:requestId', authenticate, authorize(['ADMIN']), approvePayout);

export default router;
