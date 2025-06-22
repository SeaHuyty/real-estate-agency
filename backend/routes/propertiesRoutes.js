import express from 'express';
import {
    getAllProperties, 
    getProperty,
    getTopProperty,
    getSimilarProperties
} from '../controllers/propertyController.js';
import log from '../middleware/log.js';

const router = express.Router();

router.use(log);

router.get('/', getAllProperties);
router.get('/top', getTopProperty);
router.get('/:id', getProperty);
router.get('/similar/:id', getSimilarProperties);

export default router;