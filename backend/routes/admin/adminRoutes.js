import express from 'express';
import authenticateToken from '../../middleware/authenticateToken.js';
import {
    createProperty,
    updateProperty,
    deleteProperty,
    login,
    register
} from '../../controllers/admin/adminControllers.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);


router.use(authenticateToken);

router.get('/check-auth', (req, res) => {
    res.json({ success: true, user: req.user });
});

router.post('/', createProperty);
router.put('/:id', updateProperty);
router.post('/:id', deleteProperty);

export default router;