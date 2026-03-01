"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const requestController_1 = require("../controllers/requestController");
const paymentController_1 = require("../controllers/paymentController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All routes here are ADMIN ONLY
router.use(auth_1.authenticate, (0, auth_1.authorize)(['ADMIN']));
// Admin Strategic Monitoring
router.get('/stats', adminController_1.getGlobalStats);
router.get('/logs', adminController_1.getActivityLog);
router.get('/users', adminController_1.getAllUsers);
router.get('/requests', adminController_1.getAllRequests);
router.get('/financial-dashboard', adminController_1.getFinancialDashboard);
router.get('/financials/patient/:id', adminController_1.getPatientFinancialDetails);
router.get('/caregivers/:id/performance', adminController_1.getCaregiverPerformance);
router.get('/analytics/shifts', adminController_1.getShiftAnalytics);
router.get('/analytics/advanced', adminController_1.getAdvancedAnalytics);
router.get('/analytics/overview', adminController_1.getPlatformAnalytics);
router.get('/verification/queue', adminController_1.getAllUsers);
router.post('/verification/approve/:id', adminController_1.approveCaregiver);
router.post('/verification/reject/:id', adminController_1.rejectCaregiver);
router.get('/reports/system', adminController_1.getSystemReports);
router.get('/analytics/clinical', adminController_1.getClinicalIntelligence);
// Admin Finance & Request Actions
router.post('/requests/:id/price', requestController_1.adminSetPrice); // Support both patterns
router.post('/set-price', requestController_1.adminSetPrice); // Matches web dashboard
router.patch('/requests/:id/status', requestController_1.updateRequestStatus);
router.post('/requests/create', requestController_1.adminCreateRequest);
router.post('/shifts/payout', paymentController_1.adminPayCaregiver);
// Admin User CRUD
router.get('/users/:id', adminController_1.getUserById);
router.post('/impersonate/:id', adminController_1.impersonateUser);
router.post('/shifts/:id/reassign', adminController_1.reassignShift);
router.patch('/shifts/:id/details', adminController_1.updateShiftDetails);
router.get('/operations/live', adminController_1.getLiveOperations);
router.post('/users', adminController_1.adminCreateUser);
router.patch('/users/:id', adminController_1.adminUpdateUser);
router.delete('/users/:id', adminController_1.adminDeleteUser);
exports.default = router;
