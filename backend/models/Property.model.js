/**
 * Property Model - Real Estate Listings
 * 
 * This model represents individual property listings that can be viewed,
 * searched, and filtered by customers or managed by the agency staff.
 * 
 * Database Table: properties
 * 
 * Business Rules:
 * - Each property must include title, description, location, and price
 * - `status` determines whether the property is available or not
 * - Properties can be residential, commercial, or custom-defined types
 * - `location_url` supports integration with map services
 * 
 * Use Cases:
 * - Displaying properties on the frontend
 * - Filtering by location, price, size, and more
 * - Managing listings by staff or property owners
 * 
 * @author Sea Huyty
 * @version 1.0.0
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

/**
 * Property Model Definition
 * 
 * Stores property listing information such as location, price, size, and status.
 */
const Property = sequelize.define('Property', {
    /**
     * Title - Name or label of the property
     */
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Title of the property listing'
    },

    /**
     * Description - Full description of the property
     */
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Detailed description of the property'
    },

    /**
     * Property Type - E.g., house, apartment, condo, commercial
     */
    property_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Type/category of the property'
    },

    /**
     * Address - Full street address
     */
    address: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Street address of the property'
    },

    /**
     * City - City where the property is located
     */
    city: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'City of the property'
    },

    /**
     * Province - Province or region
     */
    province: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Province or state of the property'
    },

    /**
     * Location URL - Link to maps or coordinates
     */
    location_url: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'External map URL (e.g., Google Maps link)'
    },

    /**
     * Price - Listing price
     */
    price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        comment: 'Listing price of the property'
    },

    /**
     * Size - Size of the property in square meters or feet
     */
    size: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Size of the property (e.g., in sqm)'
    },

    /**
     * Bedrooms - Number of bedrooms
     */
    bedrooms: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Total number of bedrooms'
    },

    /**
     * Bathrooms - Number of bathrooms
     */
    bathrooms: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Total number of bathrooms'
    },

    /**
     * Property Thumbnail - Image or preview photo URL
     */
    property_thumbnail: {
        type: DataTypes.TEXT,
        comment: 'Thumbnail image URL for listing preview'
    },

    /**
     * Status - Listing availability status
     */
    status: {
        type: DataTypes.STRING(50),
        defaultValue: 'available',
        comment: 'Availability status (e.g., available, sold, rented)'
    },

    /**
     * Listed Date - Date property was listed
     */
    listed_date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
        comment: 'Date when the property was listed'
    }
}, {
    // Table configuration
    tableName: 'properties',
    timestamps: false,
    underscored: true,

    // Model metadata
    comment: 'Holds property listings including location, pricing, and details'
});

export default Property;