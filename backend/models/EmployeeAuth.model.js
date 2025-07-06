/**
 * EmployeeAuth Model - Authentication Credentials for Employees
 * 
 * This model manages authentication data for employees, including login credentials
 * and role-based access control for internal systems.
 * 
 * Database Table: employee_auth
 * 
 * Relationships:
 * - One-to-One with Employee (EmployeeAuth belongs to Employee via employee_id)
 * 
 * Business Rules:
 * - Each employee can have one unique login (1:1 with Employee)
 * - Username must be unique
 * - Password is stored securely as a hash
 * - Role determines access level (e.g., admin, manager, support)
 * 
 * Example Use Cases:
 * - Secure login for internal dashboards or admin panels
 * - Role-based permissions and route protection
 * - Staff session and authentication handling
 * 
 * @author Sea Huyty
 * @version 1.0.0
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

/**
 * EmployeeAuth Model Definition
 * 
 * Stores employee login credentials and access roles.
 */
const EmployeeAuth = sequelize.define('EmployeeAuth', {
    /**
     * Employee ID - Primary key and foreign key to Employee
     */
    employee_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'employees',
            key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false,
        comment: 'Primary key and foreign key to associated employee'
    },

    /**
     * Username - Unique login identifier
     */
    username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique username for employee login'
    },

    /**
     * Password Hash - Encrypted password for secure login
     */
    password_hash: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Hashed password for authentication'
    },

    /**
     * Role - Access level or system permission group
     */
    role: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Defines access role (e.g., "admin", "manager", "staff")'
    }
}, {
    // Table configuration
    tableName: 'employee_auth',
    timestamps: true,                 // Enable created_at and updated_at fields
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,

    // Model metadata
    comment: 'Stores authentication credentials and access roles for employees'
});

export default EmployeeAuth;