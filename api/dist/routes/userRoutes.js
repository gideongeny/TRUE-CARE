"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticate, (0, auth_1.authorize)(['ADMIN']), userController_1.getUsers);
router.get('/profile', auth_1.authenticate, userController_1.getProfile);
router.get('/:id', auth_1.authenticate, userController_1.getUserById); // Added for detail pages
router.post('/update-location', auth_1.authenticate, userController_1.updateLocation); // Real-time Tracking
router.put('/profile', auth_1.authenticate, userController_1.updateProfile);
router.put('/:id/verify', auth_1.authenticate, (0, auth_1.authorize)(['ADMIN']), userController_1.verifyUser);
exports.default = router;
