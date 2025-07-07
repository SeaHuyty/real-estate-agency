import express from 'express';
import {
    verifyUser,
    getUser
} from '../../controllers/client/user.controller.js';

const router = express.Router();

router.post('/auth/google-login', verifyUser);
router.get('/', getUser);

export default router;