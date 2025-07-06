/**
 * Employee Model - Internal Staff Records
 * 
 * This model stores information about employees working within the company.
 * It supports HR-related data like job title, department, salary, and hire dates.
 * 
 * Database Table: employees
 * 
 * Business Rules:
 * - First name, last name, email, and hire date are required
 * - Email must be unique across employees
 * - Salary is optional and stored as a decimal
 * - Profile field can be used for bio or notes
 * 
 * Example Use Cases:
 * - HR and admin dashboards
 * - Managing payroll and job roles
 * - Displaying staff bios or contacts
 * 
 * @author Sea Huyty
 * @version 1.0.0
 */

import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

/**
 * Employee Model Definition
 * 
 * Represents internal employees and their roles within the company.
 */
const Employee = sequelize.define('Employee', {
    /**
     * First Name - Required given name of the employee
     */
    first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Employee’s first name'
    },

    /**
     * Last Name - Required surname of the employee
     */
    last_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Employee’s last name'
    },

    /**
     * Email - Unique contact email
     */
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique email address for the employee'
    },

    /**
     * Phone - Optional contact number
     */
    phone: {
        type: DataTypes.STRING(20),
        comment: 'Employee’s phone number'
    },

    /**
     * Date of Birth - Birth date of the employee
     */
    date_of_birth: {
        type: DataTypes.DATE,
        comment: 'Employee’s date of birth'
    },

    /**
     * Hire Date - Date employee joined the company
     */
    hire_date: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date the employee was hired'
    },

    /**
     * Job Title - Position held within the company
     */
    job_title: {
        type: DataTypes.STRING(100),
        comment: 'Official job title of the employee'
    },

    /**
     * Department - Assigned department or team
     */
    department: {
        type: DataTypes.STRING(100),
        comment: 'Department or division the employee belongs to'
    },

    /**
     * Salary - Optional monthly or yearly salary
     */
    salary: {
        type: DataTypes.DECIMAL(12, 2),
        comment: 'Employee’s salary (optional)'
    },

    /**
     * Profile - Optional bio or description
     */
    profile: {
        type: DataTypes.TEXT,
        comment: 'Profile description or additional notes about the employee'
    }
}, {
    // Table configuration
    tableName: 'employees',
    timestamps: true,                // Enable created_at and updated_at
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,

    // Model metadata
    comment: 'Stores employee data including roles, contact, and job info'
});

export default Employee;