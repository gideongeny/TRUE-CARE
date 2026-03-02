import { Router } from 'express';
import { addClinicalLog, getClinicalLogs, getPatientHealthHistory } from '../controllers/clinicalController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Caregivers can add logs, Admins can add logs
router.post('/', authenticate, authorize(['CAREGIVER', 'ADMIN']), addClinicalLog);

// Get logs for a specific shift
router.get('/shift/:shiftId', authenticate, getClinicalLogs);

// Get all logs for a patient (history)
router.get('/patient/:patientId', authenticate, getPatientHealthHistory);

export default router;
