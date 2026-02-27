import { Router } from 'express';
import {
    getGlobalStats,
    getCaregiverPerformance,
    getShiftAnalytics,
    getActivityLog,
    getAdvancedAnalytics,
    getVerificationQueue,
    getSystemReports,
    getClinicalIntelligence,
    getFinancialDashboard,
    getPatientFinancialDetails,
    approveCaregiver,
    rejectCaregiver,
    adminCreateUser,
    adminUpdateUser,
    adminDeleteUser
} from '../controllers/adminController';
import { adminSetPrice } from '../controllers/requestController';
import { adminPayCaregiver } from '../controllers/paymentController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// All routes here are ADMIN ONLY
router.use(authenticate, authorize(['ADMIN']));

router.get('/stats', getGlobalStats);
router.get('/financials', getFinancialDashboard);
router.get('/financials/patient/:id', getPatientFinancialDetails);
router.get('/caregivers/:id/performance', getCaregiverPerformance);
router.get('/analytics/shifts', getShiftAnalytics);
router.get('/analytics/advanced', getAdvancedAnalytics);
router.get('/verification/queue', getVerificationQueue);
router.post('/verification/approve/:id', approveCaregiver);
router.post('/verification/reject/:id', rejectCaregiver);
router.get('/reports/system', getSystemReports);
router.get('/analytics/clinical', getClinicalIntelligence);

// Admin Finance & Request Actions
router.post('/requests/:id/price', adminSetPrice);
router.post('/shifts/payout', adminPayCaregiver);

// Admin User CRUD
router.post('/users', adminCreateUser);
router.patch('/users/:id', adminUpdateUser);
router.delete('/users/:id', adminDeleteUser);

export default router;
