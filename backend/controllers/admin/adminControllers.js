import { sql } from '../../config/db.js'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const register = async (req, res) => {
    const { username, password} = req.body;
    //validate
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and Password are required' })
    }
    try {
        const query = await sql `
            select username 
                from admins 
                where username = ${username};
        `;
        if (query.length > 0) {
            return res.status(404).json({ success: false, message: 'Username already exists' })
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const insertAdmin = await sql `
            insert into admins (username, password) values (${username}, ${hashedPassword})
            returning username 
        `
        res.status(201).json({ success: true, user: insertAdmin[0] });
    } catch (err) {
        console.error('Error in register:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

export const login = async (req, res) => {
    // const username = req.body.username
    const { username, password } = req.body;
    try {
        const query = await sql `
            select * 
                from admins 
                where username = ${username};
        `;

        if (query.length === 0) {
            return res.status(404).json({ success: false, message: 'This user does not exist. Please register'})
        }

        const user = query[0];

        const match = await bcrypt.compare(password, user.password);

        if (!(match)) {
            return res.status(401).json({ success: false, message: 'Invalid password. Try again' });
        }

        const payload = { id: user.id, username: user.username };
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15m' 
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

    const { title, description, property_type, address, city, province, price, size, bedrooms, bathrooms } = req.body;

    try {
        const updatedProperty = await sql `
            UPDATE properties
            SET title = ${title}, description = ${description}, property_type = ${property_type}, address = ${address}, city = ${city}, province = ${province}, price = ${price}, size = ${size}, bedrooms = ${bedrooms}, bathrooms = ${bathrooms}
            WHERE id = ${id}
            RETURNING *;
        `;

        if (updatedProperty.length === 0) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }

        res.status(200).json({ success: true, data: updatedProperty[0] });

    } catch (error) {
        console.log('Error in updateProperty:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createProperty = async (req, res) => {
    const { title, 
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
            location_url } = req.body;
    
    console.log('res.body:', res.body);
    try {
        const newProperty = await sql `
            INSERT INTO properties (title, description, property_type, address, city, province, price, size, bedrooms, bathrooms, location_url, property_thumbnail)
            VALUES (${title}, ${description}, ${property_type}, ${address}, ${city}, ${province}, ${price}, ${size}, ${bedrooms}, ${bathrooms}, ${location_url}, ${thumbnail})
            RETURNING *;
        `;

        console.log('New property added:', newProperty);

        res.status(201).json({ success:true, data: newProperty });
    } catch (error) {
        console.log('Error in createProperty:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

