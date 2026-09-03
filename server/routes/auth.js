import express from 'express';
import { login, verify, changePassword, forgotPassword, resetPassword } from '../controller/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/change-password', authMiddleware, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/verify', authMiddleware, verify); 

export default router;