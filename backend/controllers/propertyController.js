import { sql } from '../config/db.js'; 

export const getAllProperties = async (req, res) => {
    const { province } = req.params;
    try {
        const properties = await sql `
            SELECT 
                p.*, 
                ARRAY_AGG(pi.image_url) AS images
            FROM properties p
            LEFT JOIN property_images pi ON p.id = pi.property_id
            WHERE p.province = ${province}
            GROUP BY p.id
            ORDER BY p.listed_date DESC;
        `;

        console.log('Fetched properties:', properties);
        res.status(200).json({ success:true, data: properties });
    } catch(error) {
        console.log('Error in getAllProperty:', error);
        res.status(500).json({ success: false, message: error.message});
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