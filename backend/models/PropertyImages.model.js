import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const PropertyImages = sequelize.define('PropertyImages', {
    image_url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
}, {
    tableName: 'property_images',
    timestamps: false,
    underscored: true
});

export default PropertyImages;