import cloudinary from '../../config/cloudinary.js';

export const uploadEmployeeProfile = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'employeeProfile',
            use_filename: true,
            unique_filename: false
        });

        res.status(200).json({ success: true, url: result.secure_url });
    } catch (error) {
        console.error('Error uploading thumbnail:', error);
        res.status(500).json({ success: false, message: 'Failed to upload profile' });
    }
};