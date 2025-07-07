/**
 * PropertyImages Model - Image Gallery for Properties
 * 
 * This model stores URLs of additional images associated with property listings.
 * Multiple images can be linked to a single property to enhance visual presentation.
 * 
 * Database Table: property_images
 * 
 * Relationships:
 * - Many-to-One with Property (each image belongs to a property)
 * 
 * Business Rules:
 * - Each image must have a valid URL
 * - A property can have multiple images (1:N relationship)
 * 
 * Use Cases:
 * - Displaying image galleries on property detail pages
 * - Supporting image carousels or slideshows
 * - Allowing agents to manage property media
 * 
 * @author Sea Huyty
 * @version 1.0.0
 */

import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

/**
 * PropertyImages Model Definition
 * 
 * Stores image URLs linked to specific properties.
 */
const PropertyImages = sequelize.define('PropertyImages', {
    /**
     * Image URL - Link to the image file
     */
    image_url: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'URL of the property image'
    }
}, {
    // Table configuration
    tableName: 'property_images',
    timestamps: false,
    underscored: true,

    // Model metadata
    comment: 'Holds additional image URLs for properties'
});

export default PropertyImages;