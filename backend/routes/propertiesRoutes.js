import express from 'express';
import {
    getAllProperties, 
    createProperty, 
    getProperty,
    updateProperty,
    deleteProperty
} from '../controllers/propertyController.js';

const router = express.Router();

router.get('/', getAllProperties);
router.get('/:id', getProperty);
router.post('/', createProperty);
router.put('/:id', updateProperty);
router.post('/:id', deleteProperty);


export default router;