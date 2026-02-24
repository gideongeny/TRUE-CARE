import { Router } from 'express';
import { createShift, getShifts, getAvailableShifts, claimShift, clockIn, clockOut, createReport } from '../controllers/shiftController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getShifts);
router.post('/', authenticate, authorize(['ADMIN']), createShift);
router.get('/open', authenticate, authorize(['CAREGIVER']), getAvailableShifts);
router.post('/:id/claim', authenticate, authorize(['CAREGIVER']), claimShift);
router.post('/:id/clock-in', authenticate, authorize(['CAREGIVER']), clockIn);
router.post('/:id/clock-out', authenticate, authorize(['CAREGIVER']), clockOut);
router.post('/:id/report', authenticate, authorize(['CAREGIVER']), createReport);

export default router;
