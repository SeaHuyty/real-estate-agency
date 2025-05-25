import express from 'express';
import {
    getAllProperties, 
    getProperty,
    getTopProperty
} from '../controllers/propertyController.js';

const router = express.Router();

router.get('/', getAllProperties);
router.get('/top', getTopProperty);
router.get('/:id', getProperty);

export default router;