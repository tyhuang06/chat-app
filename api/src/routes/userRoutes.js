import express from 'express';
import {
	registerUser,
	authUser,
	allUsers,
} from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, allUsers).post(registerUser);
router.post('/login', authUser);

export default router;
