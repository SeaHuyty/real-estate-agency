import { sql } from '../config/db.js';

export const getAllProperties = async (req, res) => {
    try {
        const { province, type, minprice, maxprice, bedrooms } = req.query;

        const conditions = [];
        const params = [];

        if (province) {
            params.push(province);
            conditions.push(`p.province = $${params.length}`);
        }

        if (type) {
            params.push(type);
            conditions.push(`p.property_type = $${params.length}`);
        }

        if (minprice) {
            params.push(minprice);
            conditions.push(`p.price >= $${params.length}`);
        }

        if (maxprice) {
            params.push(maxprice);
            conditions.push(`p.price <= $${params.length}`);
        }
        
        if (bedrooms) {
            params.push(bedrooms);
            conditions.push(`p.bedrooms >= $${params.length}`);
        }

        const whereClause = conditions.length
        ? `WHERE ${conditions.join(' AND ')}`
        : '';

        const query = `
            SELECT 
                p.*, 
                ARRAY_AGG(pi.image_url) AS images
            FROM properties p
            LEFT JOIN property_images pi ON p.id = pi.property_id
            ${whereClause}
            GROUP BY p.id
            ORDER BY p.listed_date DESC
        `;

        const result = await sql.query(query, params);
        res.status(200).json({ success: true, data: result });

    } catch (error) {
        console.error('getAllProperties error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
export const countProperties = async (req, res) => {
    try {
        const result = await sql `
            select count(*)
            from properties
        `;
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        console.error('countProperties error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
}
export const getProperty = async (req, res) => {
    const { id } = req.params;

    try {
        const property = await sql `
            SELECT 
                p.*, 
                ARRAY_AGG(pi.image_url) AS images,
                a.gym,
                a.swimming_pool,
                a.parking_lot,
                a.garden,
                a.balcony,
                a.security,
                a.fire_security,
                a.elevator,
                a.commercial_area,
                a.non_flooding,
                a.playground,
                a.common_area
            FROM properties p
            LEFT JOIN property_images pi ON p.id = pi.property_id
            LEFT JOIN amenities a ON p.id = a.property_id
            WHERE p.id = ${id}
            GROUP BY p.id, 
                     a.gym, a.swimming_pool, a.parking_lot, a.garden, a.balcony, a.security, 
                     a.fire_security, a.elevator, a.commercial_area, a.non_flooding, a.playground, a.common_area;
        `;

        if (property.length === 0) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }

        res.status(200).json({ success: true, data: property[0] });
    } catch (error) {
        console.log('Error in getProperty:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getTopProperty = async (req, res) => {
    try {
        const result = await sql `
            SELECT
                id,
                title,
                price,
                city,
                property_thumbnail
            FROM properties
            ORDER BY price DESC
            LIMIT 6
        `;
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('getTopProperty error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getSimilarProperties = async (req, res) => {
    try {
        const { id } = req.params;

        const property = await sql `
            SELECT
                p.*
            FROM properties p
            WHERE p.province = (
                SELECT
                    province
                FROM properties
                WHERE id = ${id}
            ) AND p.property_type = (
                SELECT
                    property_type
                FROM properties
                WHERE id = ${id}
            ) AND p.id != ${id};
        `;

        if (property.length === 0) {
            return res.status(404).json({ success: false, message: 'No similar properties found' });
        }

        res.status(200).json({ success: true, data: property });
    } catch (error) {
        console.error('getSimilarProperties error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}