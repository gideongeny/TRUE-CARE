import { Router } from 'express';
import {
    getGlobalStats,
    getCaregiverPerformance,
    getShiftAnalytics,
    getActivityLog,
    getAdvancedAnalytics,
    getSystemReports,
    getClinicalIntelligence,
    getFinancialDashboard,
    getPatientFinancialDetails,
    approveCaregiver,
    rejectCaregiver,
    adminCreateUser,
    adminUpdateUser,
    adminDeleteUser,
    getAllUsers,
    getAllRequests,
    getPlatformAnalytics,
    getUserById,
    impersonateUser,
    reassignShift,
    updateShiftDetails,
    getLiveOperations,
    getAdminInsights,
    adminSetPremium,
    adminCancelShift,
    adminEndShift,
    adminAddClinicalLog,
    systemReset,
    ping
} from '../controllers/adminController';
import { adminSetPrice, updateRequestStatus, adminCreateRequest } from '../controllers/requestController';
import { adminPayCaregiver, adminRequestManualPayment, adminConfirmManualPayment, getPendingManualPayments, adminDeletePayment } from '../controllers/paymentController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// All routes here are ADMIN ONLY
router.use(authenticate, authorize(['ADMIN']));

// --- CRITICAL MANIFEST: Priority Routes ---
// Manual Payment Verification (Must match before generic /users/:id)
router.get('/payments/pending', getPendingManualPayments);
router.post('/payments/manual-request', adminRequestManualPayment);
router.post('/payments/:id/confirm', adminConfirmManualPayment);
router.delete('/payments/:id', adminDeletePayment);

// Admin Strategic Monitoring
router.get('/stats', getGlobalStats);
router.get('/insights', getAdminInsights);
router.get('/logs', getActivityLog);
router.get('/users', getAllUsers);
router.get('/requests', getAllRequests);

router.get('/financial-dashboard', getFinancialDashboard);
router.get('/financials/patient/:id', getPatientFinancialDetails);
router.get('/caregivers/:id/performance', getCaregiverPerformance);
router.get('/analytics/shifts', getShiftAnalytics);
router.get('/analytics/advanced', getAdvancedAnalytics);
router.get('/analytics/overview', getPlatformAnalytics);
router.get('/verification/queue', getAllUsers);
router.post('/verification/approve/:id', approveCaregiver);
router.post('/verification/reject/:id', rejectCaregiver);
router.get('/reports/system', getSystemReports);
router.get('/analytics/clinical', getClinicalIntelligence);

// Admin Finance & Request Actions
router.post('/requests/:id/price', adminSetPrice); // Support both patterns
router.post('/set-price', adminSetPrice); // Matches web dashboard
router.patch('/requests/:id/status', updateRequestStatus);
router.post('/requests/create', adminCreateRequest);
router.post('/shifts/payout', adminPayCaregiver);

// Admin User CRUD
router.get('/users/:id', getUserById);
router.post('/impersonate/:id', impersonateUser);
router.post('/shifts/:id/reassign', reassignShift);
router.patch('/shifts/:id/details', updateShiftDetails);
router.get('/operations/live', getLiveOperations);
router.post('/users', adminCreateUser);
router.patch('/users/:id', adminUpdateUser);
router.put('/users/:id/premium', adminSetPremium);
router.delete('/users/:id', adminDeleteUser);

// Tactical Command Center Extensions
router.get('/health/ping', ping);
router.post('/shifts/:id/cancel', adminCancelShift);
router.post('/shifts/:id/end', adminEndShift);
router.post('/clinical/log', adminAddClinicalLog);
router.post('/system/reset', systemReset);

// (Manual Payment Verification moved to top)

export default router;
