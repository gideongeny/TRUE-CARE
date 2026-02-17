import { Router } from 'express';
import { createRequest, getRequests, updateRequestStatus } from '../controllers/requestController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, authorize(['PATIENT']), createRequest);
router.get('/', authenticate, getRequests);
router.put('/:id/status', authenticate, authorize(['ADMIN']), updateRequestStatus);

export default router;
