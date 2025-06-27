import express from 'express';
import {
    verifyUser,
    getUser
} from '../../controllers/user/userController.js';

const router = express.Router();

router.post('/auth/google-login', verifyUser);
router.get('/', getUser);

export default router;