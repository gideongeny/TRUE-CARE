import { Router } from 'express';
import { addClinicalLog, getClinicalLogs, getPatientHealthHistory, getAllClinicalHistory } from '../controllers/clinicalController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Caregivers can add logs, Admins can add logs
router.post('/', authenticate, authorize(['CAREGIVER', 'ADMIN']), addClinicalLog);

// Get logs for a specific shift
router.get('/shift/:shiftId', authenticate, getClinicalLogs);

// Get all logs for a patient (history)
router.get('/patient/:patientId', authenticate, getPatientHealthHistory);

// Patient getting their own history
router.get('/my-history', authenticate, (req: any, res: any) => {
    req.params.patientId = req.user.userId;
    return getPatientHealthHistory(req, res);
});

// Global history for admins
router.get('/history', authenticate, authorize(['ADMIN']), getAllClinicalHistory);

export default router;
