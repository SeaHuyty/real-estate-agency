import express from 'express';
import {
    getAllProperties, 
    getProperty
} from '../controllers/propertyController.js';

const router = express.Router();

router.get('/:province', getAllProperties);
router.get('/:id', getProperty);

export default router;