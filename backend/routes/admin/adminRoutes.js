import express from 'express';
import {
    createProperty,
    updateProperty,
    deleteProperty
} from '../../controllers/admin/adminControllers.js';

const router = express.Router();

router.post('/', createProperty);
router.put('/:id', updateProperty);
router.post('/:id', deleteProperty);

export default router;