import { getGlobalStats, getCaregiverPerformance, getShiftAnalytics, getActivityLog } from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// All routes here are ADMIN ONLY
router.use(authenticate, authorize(['ADMIN']));

router.get('/stats', getGlobalStats);
router.get('/caregivers/:id/performance', getCaregiverPerformance);
router.get('/analytics/shifts', getShiftAnalytics);
router.get('/analytics/advanced', getAdvancedAnalytics);
router.get('/verification/queue', getVerificationQueue);
router.get('/reports/system', getSystemReports);
router.get('/logs', getActivityLog);

export default router;
