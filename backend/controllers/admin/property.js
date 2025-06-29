import { sql } from '../../config/db.js';
import { client } from '../../config/redisClient.js';

export const getAllProperties = async (req, res) => {
    try {
        const result = await sql `
            SELECT 
                property_thumbnail, 
                id,
                title,
                price,
                address
            FROM properties
            ORDER BY listed_date DESC;
        `;
        
        res.status(200).json({ success: true, data: result });

    } catch (error) {
        console.error('getAllProperties error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};