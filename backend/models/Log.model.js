/**
 * Log Model - System Access and Request Logs
 * 
 * This model records activity logs such as HTTP requests made to the server.
 * It helps with monitoring, debugging, and auditing system usage.
 * 
 * Database Table: logs
 * 
 * Use Cases:
 * - Tracking API access (method, route, timestamp, and IP address)
 * - Auditing system interactions
 * - Identifying suspicious or unauthorized behavior
 * - Debugging application issues
 * 
 * Business Rules:
 * - `log_time` defaults to current time
 * - Fields like `method`, `route`, and `ip_address` are optional for flexibility
 * 
 * @author Sea Huyty
 * @version 1.0.0
 */

import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

/**
 * Log Model Definition
 * 
 * Stores log entries for system or API access.
 */
const Log = sequelize.define('Log', {
    /**
     * Log Time - Timestamp of the request
     */
    log_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        comment: 'Time when the request or event was logged'
    },

    /**
     * HTTP Method - GET, POST, PUT, DELETE, etc.
     */
    method: {
        type: DataTypes.STRING(10),
        allowNull: true,
        comment: 'HTTP method used in the request (e.g., GET, POST)'
    },

    /**
     * Route - URL or path accessed
     */
    route: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'API endpoint or route accessed'
    },

    /**
     * IP Address - Origin IP of the request
     */
    ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true,
        comment: 'IP address from which the request was made'
    }
}, {
    // Table configuration
    tableName: 'logs',
    underscored: true,
    timestamps: false,

    // Model metadata
    comment: 'Records system access logs including HTTP method, route, and IP'
});

export default Log;