import { sql } from '../../config/db.js'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cloudinary from '../../config/cloudinary.js';

dotenv.config();

export const getEmployees = async (req, res) => {
    try {
        const employees = await sql`
            SELECT * FROM employees;
        `;
        res.status(200).json({ success: true, data: employees });
    } catch (error) {
        console.error('Error in getEmployees:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getEmployeeById = async (req, res) => {
    const { id } = req.params;
    try {
        const employeeResult = await sql `
            select * from employees where id = ${id};
        `;
        if (employeeResult.length === 0) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }
        res.status(200).json({ success: true, data: employeeResult[0] });
    } catch (err) {
        console.error('Error to get employee by id', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}
export const getEmployeeProfile = async (req, res) => {
    const { id } = req.query;
    try {
        const employees = await sql`
            SELECT profile, id, first_name, last_name FROM employees
            where id = ${id};
        `;
        res.status(200).json({ success: true, data: employees[0] });
    } catch (error) {
        console.error('Error in getEmployees:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const createEmployee = async (req, res) => {
    const { 
        id,
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
        const checkId = await sql `
            select id from employees where id = ${id};
        `;
        if (checkId.length > 0) {
            return res.status(400).json({ success: false, message: 'Employee ID already exists' });
        }
        const query = await sql `
            insert into employees (id, first_name, last_name, email, phone, date_of_birth, hire_date, job_title, department, salary, profile)
            values (${id}, ${firstName}, ${lastName}, ${email}, ${phoneNumber}, ${dob}, ${hireDate}, ${jobTitle}, ${department}, ${salary}, ${profile})
            returning id;
        `
        res.status(201).json({ success: true, id: query[0].id });
    } catch (err) {
        console.error('Error in createEmployee:', err);
        res.status(500).json({ success: false, message: err.message });
    }
}

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
        console.log('hello');
        const updateEmployee = await sql `
            update employees
            set 
                first_name = ${firstName}, last_name = ${lastName}, email = ${email}, phone = ${phoneNumber},
                date_of_birth = ${dob}, hire_date = ${hireDate}, job_title = ${jobTitle}, department = ${department},
                salary = ${salary}, profile = ${profile}
            where id = ${id} returning *;
        `
        if (updateEmployee.length === 0) {
            return res.status(404).json( { success: false, message: 'Employee not found' });
        }
        res.status(200).json({ success: true, data: updateEmployee[0] });
        // res.status(200).json({ success: true, updateEmployee[0] });
    } catch (err) { 
        console.log('Error in update employee', err);
    }
}

export const deleteEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteEmployee = await sql `
            delete from employees where id = ${id} 
            returning *;
        `;
        if (deleteEmployee.length === 0) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }
        res.status(200).json({ success: true, data: deleteEmployee });
    } catch (err) {
        console.log('Error Delete employee', err);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const register = async (req, res) => {
    const { username, password, id } = req.body;
    // validate
    console.log(id);
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ success: false, message: 'not a valid Employee ID' })
    }
    if (!username || !password || !id) {
        return res.status(400).json({ success: false, message: 'Username, Password and Employee ID are required' })
    } 

    try {
        const query = await sql `
            select username from employee_auth
                where username = ${username};
        `;
        if (query.length > 0) {
            return res.status(404).json({ success: false, message: 'Username already exists' })
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const insertAdmin = await sql `
            insert into employee_auth (employee_id, username, password_hash, role) values (${id}, ${username}, ${hashedPassword}, 'admin')
            returning username 
        `;
        const user =  insertAdmin[0];
        const payload = {id: user.id, username: user.username};
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h' // Token will expire in 1 hour
        });
        res.status(201).json( {
            success: true,
            accessToken: accessToken
        })
    } catch (err) {
        console.error('Error in register:', err);
    }
}

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const query = await sql `
            select * from employee_auth
                where username = ${username};
        `;

        if (query.length === 0) {
            return res.status(404).json({ success: false, message: 'This user does not exist. Please register'})
        }

        const user = query[0];

        const match = await bcrypt.compare(password, user.password_hash);

        if (!(match)) {
            return res.status(401).json({ success: false, message: 'Invalid password. Try again' });
        }

        const payload = { id: user.employee_id, username: user.username };
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h' 
        });

        return res.json({ success: true, accessToken: accessToken })
    } catch (error) {
        console.log('Error in login:', error);
    }
}

export const deleteProperty = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProperty = await sql `
            DELETE FROM properties WHERE id = ${id} RETURNING *;
        `;

        // check if product was deleted
        if (deletedProperty.length === 0) {
            return res.status(404).json({ success: false, message: "Property not found" });
        }

        res.status(200).json({ success: true, data: deletedProperty });
    } catch (error) {
        console.log('Error in deleteProperty:', error);
        res.status(500).json({ success: false, message: error.message });
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
        const updatedProperty = await sql `
            UPDATE properties
            SET 
                title = ${title}, 
                description = ${description}, 
                property_type = ${property_type}, 
                address = ${address}, 
                city = ${city}, 
                province = ${province}, 
                price = ${price}, 
                size = ${size}, 
                bedrooms = ${bedrooms}, 
                bathrooms = ${bathrooms}, 
                location_url = ${location_url},
                property_thumbnail = ${thumbnail}
            WHERE id = ${id}
            RETURNING *;
        `;

        if (updatedProperty.length === 0) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }

        await sql `
            UPDATE amenities
            SET 
                gym = ${gym},
                swimming_pool = ${swimming_pool},
                parking_lot = ${parking_lot},
                garden = ${garden},
                balcony = ${balcony},
                security = ${security},
                fire_security = ${fire_security},
                elevator = ${elevator},
                commercial_area = ${commercial_area},
                non_flooding = ${non_flooding},
                playground = ${playground},
                common_area = ${common_area}
            WHERE property_id = ${id};
        `;
        
        // If images array is provided, update the images
        if (images !== undefined) {
            // Delete old images first
            await sql`DELETE FROM property_images WHERE property_id = ${id}`;

            // Insert new images if any
            if (Array.isArray(images) && images.length > 0) {
                await Promise.all(images.map(imageUrl => 
                    sql`INSERT INTO property_images (property_id, image_url) VALUES (${id}, ${imageUrl})`
                ));
            }
        }

        // Fetch the fully updated property data to return
        const finalData = await sql`
            SELECT p.*, a.*, 
                   (SELECT json_agg(pi.image_url) FROM property_images pi WHERE pi.property_id = p.id) as images
            FROM properties p
            LEFT JOIN amenities a ON p.id = a.property_id
            WHERE p.id = ${id}
            GROUP BY p.id, a.property_id;
        `;

        res.status(200).json({ success: true, data: finalData[0] });

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
        const newProperty = await sql `
            INSERT INTO properties (
                title, description, property_type, address, city, province, 
                price, size, bedrooms, bathrooms, location_url, property_thumbnail
            )
            VALUES (
                ${title}, ${description}, ${property_type}, ${address}, ${city}, 
                ${province}, ${price}, ${size}, ${bedrooms}, ${bathrooms}, 
                ${location_url}, ${thumbnail}
            )
            RETURNING id;
        `;

        const propertyId = newProperty[0].id;

        // Insert images if any
        if (images.length > 0) {
            await Promise.all(images.map(imageUrl => 
                sql`INSERT INTO property_images (property_id, image_url) VALUES (${propertyId}, ${imageUrl})`
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

        await sql`
            INSERT INTO amenities (
                property_id, swimming_pool, gym, parking_lot, garden, balcony, security,
                fire_security, elevator, commercial_area, non_flooding, playground, common_area
            )
            VALUES (
                ${propertyId}, ${swimming_pool}, ${gym}, ${parking_lot}, ${garden}, ${balcony}, ${security},
                ${fire_security}, ${elevator}, ${commercial_area}, ${non_flooding}, ${playground}, ${common_area}
            );
        `;

        res.status(201).json({ 
            success: true, 
            data: { id: propertyId, images, amenities }
        });
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