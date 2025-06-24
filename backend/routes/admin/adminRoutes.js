import express from 'express';
import authenticateToken from '../../middleware/authenticateToken.js';
import {
    createProperty,
    updateProperty,
    deleteProperty,
    login,
    register,
    uploadThumbnail,
    getEmployees
} from '../../controllers/admin/adminControllers.js';
import upload from '../../middleware/multer.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);


router.use(authenticateToken);

router.get('/check-auth', (req, res) => {
    res.json({ success: true, user: req.user });
});

router.get('/employees', getEmployees);
router.post('/', createProperty);
router.put('/:id', updateProperty);
router.delete('/:id', deleteProperty);
router.post('/upload/thumbnail', upload.single('thumbnail'), uploadThumbnail);

export default router;