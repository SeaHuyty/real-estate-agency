/**
 * VisitRequest Model - Property Visit Scheduling
 * 
 * This model represents customer requests to schedule visits or tours 
 * for listed properties. It tracks the request status and assignment.
 * 
 * Database Table: visit_requests
 * 
 * Relationships:
 * - Many-to-One with User (user_id: the customer requesting the visit)
 * - Many-to-One with Property (property_id: the property to be visited)
 * - Many-to-One with Employee/Agency (assigned_agency_id: optional handler)
 * 
 * Business Rules:
 * - A visit request must be linked to a user and a property
 * - Status values include: 'pending', 'assigned', 'completed'
 * - The agency can update the status and add internal notes
 * 
 * Use Cases:
 * - Customers requesting a property tour
 * - Admin/agency staff assigning agents to handle requests
 * - Tracking visit history and outcomes
 * 
 * @author Sea Huyty
 * @version 1.0.0
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

/**
 * VisitRequest Model Definition
 * 
 * Stores visit scheduling requests for property listings.
 */
const VisitRequest = sequelize.define('VisitRequest', {
    /**
     * User ID - Customer requesting the visit
     */
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID of the user requesting the property visit'
    },

    /**
     * Property ID - Property to be visited
     */
    property_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID of the property the user wants to visit'
    },

    /**
     * Preferred Date - Requested date for the visit
     */
    preferred_date: {
        type: DataTypes.DATEONLY,
        comment: 'Preferred date selected by the user for the visit'
    },

    /**
     * Status - State of the visit request
     */
    status: {
        type: DataTypes.ENUM('pending', 'assigned', 'completed'),
        defaultValue: 'pending',
        comment: 'Current status of the visit request'
    },

    /**
     * Assigned Agency ID - Staff or agent assigned to the visit
     */
    assigned_agency_id: {
        type: DataTypes.INTEGER,
        comment: 'ID of the agency or employee assigned to handle the visit'
    },

    /**
     * Notes - Internal notes or special instructions
     */
    notes: {
        type: DataTypes.TEXT,
        comment: 'Additional notes about the visit request'
    },

    /**
     * Created At - Timestamp of request creation
     */
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        comment: 'Timestamp when the visit request was created'
    }
}, {
    // Table configuration
    tableName: 'visit_requests',
    timestamps: false,
    underscored: true,

    // Model metadata
    comment: 'Stores customer requests to schedule property visits'
});

export default VisitRequest;