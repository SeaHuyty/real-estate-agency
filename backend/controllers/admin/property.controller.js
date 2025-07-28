import { Property } from '../../models/Index.js';
import { Op, Sequelize } from 'sequelize';

export const getAllProperties = async (req, res) => {
    const { province, type, minprice, maxprice, bedrooms, page = 1, limit = 6, search = '' } = req.query;

    try {
        const where = { status: 'available' };

        if (province) where.province = province;
        if (type) where.property_type = type;
        if (minprice) where.price = { ...(where.price || {}), [Op.gte]: parseFloat(minprice) };
        if (maxprice) where.price = { ...(where.price || {}), [Op.lte]: parseFloat(maxprice) };
        if (bedrooms) where.bedrooms = { [Op.gte]: parseInt(bedrooms) };

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