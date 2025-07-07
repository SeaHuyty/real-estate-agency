/**
 * Customer Model - Registered Users / Buyers
 * 
 * This model represents customers who can browse, purchase, and review properties or services.
 * It supports both local and third-party (e.g., Google) authentication methods.
 * 
 * Database Table: customers
 * 
 * Authentication:
 * - Supports both local (email/password) and Google sign-in (OAuth)
 * - `provider` field tracks the source of registration
 * - `password` is only used for local accounts
 * 
 * Business Rules:
 * - Email must be unique
 * - Google accounts must have unique Google ID
 * - Name and email are required fields
 * - Created timestamp is auto-set on account creation
 * 
 * Example Use Cases:
 * - Authentication & login system
 * - Linking customer to reviews, orders, or messages
 * - Showing profile details on dashboard or admin panel
 * 
 * @author Sea Huyty
 * @version 1.0.0
 */

import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

/**
 * Customer Model Definition
 * 
 * Represents users of the platform, whether they are property seekers or listers.
 */
const Customer = sequelize.define('Customer', {
    /**
     * Provider - Indicates login method (e.g., local or Google)
     */
    provider: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'local'
    },

    /**
     * Password - Hashed password (only used if provider is "local")
     */
    password: {
        type: DataTypes.TEXT
    },

    /**
     * Google ID - Unique identifier for Google OAuth users
     */
    google_id: {
        type: DataTypes.TEXT,
        unique: true
    },

    /**
     * Name - Full name of the customer
     */
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    /**
     * Email - Unique contact email
     */
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },

    /**
     * Phone - Optional contact number
     */
    phone: {
        type: DataTypes.STRING(20)
    },

    /**
     * Picture - Profile photo URL or file path
     */
    picture: {
        type: DataTypes.TEXT
    },

    /**
     * Created At - Timestamp of account creation
     */
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
}, {
    // Table configuration
    tableName: 'customers',
    timestamps: false,
    underscored: true,

    // Model metadata
    comment: 'Represents users who can be buyers or property listers'
});

export default Customer;