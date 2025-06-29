import express from 'express';
import authenticateToken from '../../middleware/authenticateToken.js';
import {
    createEmployee,
    createProperty,
    updateProperty,
    deleteProperty,
    login,
    register,
    uploadThumbnail,
    getEmployees,
    uploadEmployeeProfile,
    getEmployeeProfile,
    updateEmployee,
    deleteEmployee,
    getEmployeeById
} from '../../controllers/admin/adminControllers.js';
import upload from '../../middleware/multer.js';
import { getAllProperties } from '../../controllers/admin/property.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/createEmployee', createEmployee);
router.get('/employees', getEmployees);
router.get('/employeeProfile', getEmployeeProfile);
router.get('/employees/:id', getEmployeeById);
router.put('/employees/:id', updateEmployee);
router.delete('/employees/:id', deleteEmployee);
router.post('/upload/employeeProfile', upload.single('employeeProfile'), uploadEmployeeProfile);

router.use(authenticateToken);

router.get('/check-auth', (req, res) => {
    res.json({ success: true, user: req.user });
});

router.get('/', getAllProperties);
router.post('/', createProperty);
router.put('/:id', updateProperty);
router.delete('/:id', deleteProperty);
router.post('/upload/thumbnail', upload.single('thumbnail'), uploadThumbnail);

export default router;