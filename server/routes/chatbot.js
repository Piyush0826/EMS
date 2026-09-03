import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { sendChatbotMessage } from '../controller/chatbotController.js';

const router = express.Router();

router.post('/message', authMiddleware, sendChatbotMessage);

export default router;