import express from 'express';
import {
    createRequest,
    getAllRequests,
    updateRequest,
    getRequestById,
    deleteRequest  // Add this import
} from '../controllers/request.controller.js';
import authenticateToken from '../middleware/authenticateToken.js';
import authenticateUser from '../middleware/authenticateUser.js';
import authenticateAny from '../middleware/authenticateAny.js';

const router = express.Router();

// Use different authentication for different routes
// Admin-only routes (getAllRequests, updateRequest, deleteRequest)
router.get('/', authenticateToken, getAllRequests);
router.get('/:id', authenticateAny, getRequestById);
router.put('/:id', authenticateToken, updateRequest);
router.delete('/:id', authenticateToken, deleteRequest);

// User routes (createRequest)
router.post('/', authenticateUser, createRequest);

export default router;