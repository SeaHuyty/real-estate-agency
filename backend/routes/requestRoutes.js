import express from 'express';
import {
    createRequest,
    getAllRequests,
    updateRequest,
    getRequestById  // Add this import
} from '../controllers/requestController.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', createRequest);
router.get('/', getAllRequests);
router.get('/:id', getRequestById); 
router.put('/:id', updateRequest);

export default router;