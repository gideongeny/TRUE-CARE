import { Router } from 'express';
import { createShift, getShifts } from '../controllers/shiftController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getShifts);
router.post('/', authenticate, authorize(['ADMIN']), createShift); // Only Admin creates shifts for now

export default router;
