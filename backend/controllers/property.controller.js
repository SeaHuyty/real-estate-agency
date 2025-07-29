import { client } from '../config/redisClient.js';
import { Amenity, Property, PropertyImages } from '../models/Index.js';
import { Op, Sequelize } from 'sequelize';

export const getAllProperties = async (req, res) => {
    const { province, type, minprice, maxprice, bedrooms, page = 1, limit = 6, search = '' } = req.query;

    try {
        const where = { status: 'available' };

        if (province) where.province = province;
        if (type) where.property_type = type;
        if (minprice) where.price = { ...(where.price || {}), [Op.gte]: parseFloat(minprice) };
        if (maxprice) where.price = { ...(where.price || {}), [Op.lte]: parseFloat(maxprice) };

    // ← free‑text search
        if (search.trim()) {
            where[Op.or] = [
                { title:         { [Op.iLike]: `%${search}%` } },
                { city:          { [Op.iLike]: `%${search}%` } },
                { province:      { [Op.iLike]: `%${search}%` } },
                { property_type: { [Op.iLike]: `%${search}%` } },
                Sequelize.where(
                Sequelize.cast(Sequelize.col('id'), 'TEXT'),
                { [Op.iLike]: `%${search}%` }
                ),
            ];
        }

        const pageNumber = parseInt(page);
        const pageSize = parseInt(limit);
        const offset = (pageNumber - 1) * pageSize;

        // Fetch paginated data and total count
        const { count, rows } = await Property.findAndCountAll({
            where,
            attributes: [
                'id',
                'property_thumbnail',
                'title',
                'bedrooms',
                'bathrooms',
                'price',
                'size',
                'address',
                'city'
            ],
            order: [['listed_date', 'DESC']],
            offset,
            limit: pageSize,
        });

        const pageCount = Math.ceil(count / pageSize);

        res.status(200).json({
            success: true,
            data: rows,
            meta: {
                total: count,
                page: pageNumber,
                limit: pageSize,
                pageCount,
                hasPrev: pageNumber > 1,
                hasNext: pageNumber < pageCount,
            }
        });
    } catch (error) {
        console.error('getAllProperties error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const countProperties = async (req, res) => {
    const cacheKey = 'countProperties';
    try {
        // Check Redis cache first
        const cachedData = await client.get(cacheKey);
        if (cachedData) {
            return res.status(200).json({ success: true, source: 'redis', data: cachedData });
        }

        // If no cache data, retrieve from database
        const result = await Property.count();

        // Cache the data in Redis for 5 minutes (300 seconds)
        await client.setEx(cacheKey, 300, result);

        res.status(200).json({ success: true, source: 'database', data: result });
    } catch (error) {
        console.error('countProperties error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getProperty = async (req, res) => {
    const { id } = req.params;
    const cacheKey = `property:${id}`;

    try {
        const cached = await client.get(cacheKey);
        if (cached) {
            return res.status(200).json({ success: true, source: 'redis', data: JSON.parse(cached) });
        }

        const property = await Property.findOne({
            where: { id },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            include: [
                {
                    model: PropertyImages,
                    as: 'images',
                    attributes: ['image_url']
                },
                {
                    model: Amenity,
                    as: 'amenities',
                    attributes: [
                        'gym', 'swimming_pool', 'parking_lot', 'garden', 'balcony',
                        'security', 'fire_security', 'elevator', 'commercial_area',
                        'non_flooding', 'playground', 'common_area'
                    ]
                }
            ]
        });

        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }

        
        const raw = property.toJSON();
        
        // Flatten image URLs from [{ image_url: ... }] → [url1, url2]
        raw.images = raw.images.map(img => img.image_url);
        
        // Flatten amenities into top-level keys
        if (raw.amenities) {
            Object.assign(raw, raw.amenities);
            delete raw.amenities;
        }
        
        // Cache it for 5 minutes
        await client.setEx(cacheKey, 300, JSON.stringify(raw));
        await client.del(cacheKey);

        res.status(200).json({ success: true, data: raw });

    } catch (error) {
        console.error('Error in getProperty:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getTopProperty = async (req, res) => {
    const cacheKey = 'topProperty';
    try {
        const cachedData = await client.get('topProperty');
        if (cachedData) {
            return res.status(200).json({ success: true, data: JSON.parse(cachedData) });
        }

        const result = await Property.findAll({
            attributes: {
                include: ['id', 'title', 'price', 'city', 'property_thumbnail']
            },
            order: [['price', 'DESC']],
            limit: 6
        });

        await client.setEx(cacheKey, 300, JSON.stringify(result));

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('getTopProperty error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getSimilarProperties = async (req, res) => {
    try {
        const { id } = req.params;

        // Get the property info for the given ID
        const reference = await Property.findOne({
            where: { id },
            attributes: ['province', 'property_type']
        });

        if (!reference) {
            return res.status(404).json({ success: false, message: 'Reference property not found' });
        }

        // Query for similar properties
        const similarProperties = await Property.findAll({
            where: {
                province: reference.province,
                property_type: reference.property_type,
                id: { [Op.ne]: id } // not equal
            },
            attributes: [
                'id',
                'title',
                'price',
                'city',
                'property_thumbnail',
                'bedrooms',
                'bathrooms'
            ]
        });

        if (similarProperties.length === 0) {
            return res.status(404).json({ success: false, message: 'No similar properties found' });
        }

        res.status(200).json({ success: true, data: similarProperties });
    } catch (error) {
        console.error('getSimilarProperties error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};