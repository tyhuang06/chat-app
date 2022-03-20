import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
	accessChat,
	fetchChats,
	createGroupChat,
	renameGroup,
	addToGroup,
	removeFromGroup,
} from '../controllers/chatController.js';

const router = express.Router();

// Create or get chat with another user
router.route('/').post(protect, accessChat);
// Get all chats for current user
router.route('/').get(protect, fetchChats);

router.route('/group').post(protect, createGroupChat);
router.route('/group/rename').put(protect, renameGroup);
router.route('/group/add').put(protect, addToGroup);
router.route('/group/remove').put(protect, removeFromGroup);

export default router;
