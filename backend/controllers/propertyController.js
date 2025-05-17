import { sql } from '../config/db.js'; 

export const getAllProperties = async (req, res) => {
    try {
        const properties = await sql `
            SELECT p.*
            FROM properties p
            LEFT JOIN property_images pi ON p.id = pi.property_id
            LEFT JOIN amenities a ON p.id = a.property_id
            ORDER BY p.listed_date DESC;
        `;

        console.log('Fetched properties:', properties);
        res.status(200).json({ success:true, data: properties });
    } catch(error) {
        console.log('Error in getAllProperty:', error);
        res.status(500).json({ success: false, message: error.message});
    }
};

export const createProperty = async (req, res) => {
    const { title, description, property_type, address, city, province, price, size, bedrooms, bathrooms } = req.body;

    if (!title || !description || !property_type || !address || !city || !province || !price || !size || !bedrooms || !bathrooms) {
        return res.status(400).json({ success: false, message: 'Please fill all the fields' });
    }

    try {
        const newProperty = await sql `
            INSERT INTO properties (title, description, property_type, address, city, province, price, size, bedrooms, bathrooms)
            VALUES (${title}, ${description}, ${property_type}, ${address}, ${city}, ${province}, ${price}, ${size}, ${bedrooms}, ${bathrooms})
            RETURNING *;
        `;

        console.log('New property added:', newProperty);

        // Test with Postman
        res.status(201).json({ success:true, data: newProperty[0] });
    } catch (error) {
        console.log('Error in createProperty:', error);
        res.status(500).json({ success: false, message: error.message });
    }
    
};

export const getProperty = async (req, res) => {
    const { id } = req.params

    try {
        const property = await sql `
            SELECT * FROM properties WHERE id = ${id};
        `;

        res.status(200).json({ success: true, data: property[0] });
    } catch (error) {
        console.log('Error in getProperty:', error);
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

        res.status(200).json({ success: true, date: deletedProperty[0] });
    } catch (error) {
        console.log('Error in deleteProperty:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};