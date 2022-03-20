import express from 'express';
import { sendMessage, allMessages } from '../controllers/messageController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, sendMessage);
router.route('/:chatId').get(protect, allMessages);

export default router;
