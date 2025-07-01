import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cloudinary from '../../config/cloudinary.js';
import Employee from '../../models/Employee.js';
import EmployeeAuth from '../../models/EmployeeAuth.js';
import Property from '../../models/Property.js';
import Amenity from '../../models/Amenity.js';
import PropertyImages from '../../models/PropertyImages.js';

dotenv.config();

export const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.findAll({})
        
        res.status(200).json({ success: true, data: employees });
    } catch (error) {
        console.error('Error in getEmployees:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getEmployeeById = async (req, res) => {
    const { id } = req.params;
    try {
        const employeeResult = await Employee.findByPk(id);

        if (employeeResult.length === 0) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }
        res.status(200).json({ success: true, data: employeeResult });
    } catch (err) {
        console.error('Error to get employee by id', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const createEmployee = async (req, res) => {
    const { 
        firstName,
        lastName,
        email,
        phoneNumber,
        dob,
        hireDate,
        jobTitle,
        department,
        salary,
        profile
    } = req.body;

    try {
        const query = await Employee.create({
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phoneNumber,
            date_of_birth: dob,
            hire_date: hireDate,
            job_title: jobTitle,
            department: department,
            salary: salary,
            profile: profile
        });
        
        res.status(201).json({ success: true, id: query.id });
    } catch (err) {
        console.error('Error in createEmployee:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateEmployee = async (req, res) => {
    const { id } = req.params;
    
    const { 
        firstName,
        lastName,
        email,
        phoneNumber,
        dob,
        hireDate,
        jobTitle,
        department,
        salary,
        profile
    } = req.body;
    
    try {
        const [count, updateEmployee] = await Employee.update({
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phoneNumber,
            date_of_birth: dob,
            hire_date: hireDate,
            job_title: jobTitle,
            department: department,
            salary: salary,
            profile: profile
        }, {
            where: { id: id },
            returning: true
        });
        
        if (count === 0) {
            return res.status(404).json( { success: false, message: 'Employee not found' });
        }
        res.status(200).json({ success: true, data: updateEmployee[0] });
    } catch (error) { 
        console.log('Error in update employee', error);
        res.status(500).json({ success: false, message: 'Internal Server error' });
    }
};

export const deleteEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteCount = await Employee.destroy({
            where: { id: id }
        });
        
        if (deleteCount === 0) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }
        res.status(200).json({ success: true, message: 'Employee deleted successfully' });
    } catch (error) {
        console.log('Error DeleteEmployee', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const register = async (req, res) => {
    const { username, password, id } = req.body;

    // NOTE: You might wanna check if the id exist in the employee table

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ success: false, message: 'not a valid Employee ID' })
    }

    if (!username || !password || !id) {
        return res.status(400).json({ success: false, message: 'Username, Password and Employee ID are required' })
    } 

    try {
        const query = await EmployeeAuth.findOne({
            where: { username: username },
            attributes: ['username']
        });
        
        if (query) {
            return res.status(409).json({ success: false, message: 'Username already exists' })
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const insertAdmin = await EmployeeAuth.create({
            employee_id: id,
            username: username,
            password_hash: hashedPassword,
            role: 'admin'
        });

        const payload = {id: insertAdmin.id, username: insertAdmin.username};
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h' // Token will expire in 1 hour
        });

        res.status(201).json({ success: true, accessToken: accessToken });
    } catch (error) {
        console.error('Error in register:', error);
        res.status(500).json({ success: false, message: 'Error Internal Server' });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await EmployeeAuth.findOne({
            where: { username: username }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'This user does not exist. Please register'})
        }

        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.status(401).json({ success: false, message: 'Invalid Credentials' });
        }

        const payload = { id: user.employee_id, username: user.username };
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h' 
        });

        return res.json({ success: true, accessToken: accessToken })
    } catch (error) {
        console.log('Error in login:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const deleteProperty = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCount = await Property.destroy({
            where: { id: id }
        });

        // Check if product was deleted
        if (deletedCount === 0) {
            return res.status(404).json({ success: false, message: "Property not found" });
        }

        res.status(200).json({ success: true, message: 'Property deleted successfully' });
    } catch (error) {
        console.log('Error in deleteProperty:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const updateProperty = async (req, res) => {
    const { id } = req.params;

    const { 
        title, description, property_type, address, city, province, price, size, bedrooms, bathrooms, location_url,
        swimming_pool, gym, parking_lot, garden, balcony, security, fire_security, elevator, commercial_area, non_flooding, playground, common_area,
        images, // Expect an array of image URLs
        thumbnail // Expect the thumbnail URL
    } = req.body;

    try {
        const [propertyCount] = await Property.update({
            title: title,
            description: description,
            property_type: property_type,
            address: address,
            city: city,
            province: province,
            price: price,
            size: size,
            bedrooms: bedrooms,
            bathrooms: bathrooms,
            location_url: location_url,
            property_thumbnail: thumbnail
        }, {
            where: { id: id },
        });

        if (propertyCount === 0) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }

        const [amenityCount] = await Amenity.update({
            gym: gym,
            swimming_pool: swimming_pool,
            parking_lot: parking_lot,
            garden: garden,
            balcony: balcony,
            security: security,
            fire_security: fire_security,
            elevator: elevator,
            commercial_area: commercial_area,
            non_flooding: non_flooding,
            playground: playground,
            common_area: common_area
        }, {
            where: { property_id: id }
        });

        if (amenityCount === 0) {
            return res.status(404).json({ success: false, message: 'Property Amenity not found' });
        }
        
        // If images array is provided, update the images
        if (images !== undefined) {
            // Delete old images first
            await PropertyImages.destroy({
                where: { property_id: id }
            });

            // Insert new images if any
            if (Array.isArray(images) && images.length > 0) {
                await Promise.all(images.map(imageUrl => 
                    PropertyImages.create({
                        property_id: id,
                        image_url: imageUrl
                    })
                ));
            }
        }

        res.status(200).json({ success: true, message: 'Property Updated Successfully' });

    } catch (error) {
        console.log('Error in updateProperty:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createProperty = async (req, res) => {
    const { 
        title, 
        description, 
        property_type, 
        thumbnail,
        address, 
        city, 
        province, 
        price, 
        size, 
        bedrooms, 
        bathrooms,
        location_url,
        images = [],
        amenities = {}
    } = req.body;
    
    try {
        const newProperty = await Property.create({
            title: title,
            description: description,
            property_type: property_type,
            address: address,
            city: city,
            province: province,
            price: price,
            size: size,
            bedrooms: bedrooms,
            bathrooms: bathrooms,
            location_url: location_url,
            property_thumbnail: thumbnail
        });

        const propertyId = newProperty.id;

        // Insert images if any
        if (images.length > 0) {
            await Promise.all(images.map(imageUrl => 
                PropertyImages.create({
                    property_id: propertyId,
                    image_url: imageUrl
                })
            ));
        }

        const {
            swimming_pool = false,
            gym = false,
            parking_lot = false,
            garden = false,
            balcony = false,
            security = false,
            fire_security = false,
            elevator = false,
            commercial_area = false,
            non_flooding = false,
            playground = false,
            common_area = false
        } = amenities;

        await Amenity.create({
            property_id: propertyId,
            swimming_pool: swimming_pool,
            gym: gym,
            parking_lot: parking_lot,
            garden: garden,
            balcony: balcony,
            security: security,
            fire_security: fire_security, 
            elevator: elevator, 
            commercial_area: commercial_area, 
            non_flooding: non_flooding, 
            playground: playground, 
            common_area: common_area
        });

        res.status(201).json({ success: true, message: 'Property Created Successfully' });
    } catch (error) {
        console.log('Error in createProperty:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const uploadThumbnail = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'property_thumbnails',
            use_filename: true,
            unique_filename: false
        });

        res.status(200).json({ success: true, url: result.secure_url });
    } catch (error) {
        console.error('Error uploading thumbnail:', error);
        res.status(500).json({ success: false, message: 'Failed to upload thumbnail' });
    }
};