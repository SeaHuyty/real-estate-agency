/**
 * Amenity Model - Property Features & Facilities
 * 
 * This model represents the amenities available for a given property.
 * It allows boolean tracking of available features like gym, pool, elevator, etc.
 * 
 * Database Table: amenities
 * 
 * Relationships:
 * - One-to-One with Property (Amenity belongs to Property)
 * 
 * Business Rules:
 * - Each property can have one amenity record
 * - Amenity flags are optional and default to false
 * 
 * Example Use Cases:
 * - Displaying available features on property listings
 * - Filtering search results by amenities
 * - Managing amenity offerings in property management dashboard
 * 
 * @author Sea Huyty
 * @version 1.0.0
 */

import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

/**
 * Amenity Model Definition
 * 
 * Defines available features for a specific property.
 * Each amenity is a boolean flag.
 */
const Amenity = sequelize.define('Amenity', {
    /**
     * Property ID - Primary key and foreign key to properties table
     */
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

    /**
     * Gym - Whether the property includes a gym
     */
    gym: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    /** 
     * Swimming Pool - Whether the property includes a swimming pool
     */
    swimming_pool: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    /**
     * Parking Lot - Availability of dedicated parking
     */
    parking_lot: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    /**
     * Garden - Availability of garden or green space
     */
    garden: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    /**
     * Balcony - Whether units have balconies
     */
    balcony: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    /**
     * Security - Whether the property has security personnel or systems
     */
    security: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    /**
     * Fire Security - Whether fire safety systems are installed
     */
    fire_security: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    /**
     * Elevator - Whether an elevator is present
     */
    elevator: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    /**
     * Commercial Area - Presence of on-site commercial shops
     */
    commercial_area: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    /**
     * Non-Flooding - Whether the area is certified as non-flooding
     */
    non_flooding: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    /**
     * Playground - Whether there's a children's play area
     */
    playground: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    /**
     * Common Area - Availability of shared common spaces
     */
    common_area: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    // Table configuration
    tableName: 'amenities',
    underscored: true,
    timestamps: false,

    // Model metadata
    comment: 'Represents available amenities for a property'
});

export default Amenity;