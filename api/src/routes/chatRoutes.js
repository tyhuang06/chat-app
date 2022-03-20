import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { accessChat } from '../controllers/chatController.js';

const router = express.Router();

router.route('/').post(protect, accessChat);
/* router.route('/').get(protect, fetchChats);

router.route('/group').post(protect, createGroupChat);
router.route('/group/rename').put(protect, renameGroup);
router.route('/group/remove').put(protect, removeFromGroup);
router.route('/group/add').put(protect, addToGroup); */

export default router;
