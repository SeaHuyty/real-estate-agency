import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const Amenity = sequelize.define('Amenity', {
    property_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'properties',
            key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
    },
    gym: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    swimming_pool: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    parking_lot: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    garden: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    balcony: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    security: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    fire_security: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    elevator: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    commercial_area: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    non_flooding: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    playground: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    common_area: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'amenities',
    underscored: true,
    timestamps: false
});

export default Amenity;