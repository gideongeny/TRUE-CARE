import { Router } from 'express';
import { uploadVerificationDoc, getVerificationStatus } from '../controllers/verificationController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/upload', uploadVerificationDoc);
router.get('/status', getVerificationStatus);

export default router;
