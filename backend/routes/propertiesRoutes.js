import express from 'express';
import {
    getAllProperties, 
    getProperty,
    getTopProperty,
    getSimilarProperties
} from '../controllers/propertyController.js';

const router = express.Router();

router.get('/', getAllProperties);
router.get('/top', getTopProperty);
router.get('/:id', getProperty);
router.get('/similar/:id', getSimilarProperties);

export default router;