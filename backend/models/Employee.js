import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Employee = sequelize.define('Employee', {
    first_name: {
    type: DataTypes.STRING(100),
    allowNull: false
    },
    last_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING(20)
    },
    date_of_birth: {
        type: DataTypes.DATE
    },
    hire_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    job_title: {
        type: DataTypes.STRING(100)
    },
    department: {
        type: DataTypes.STRING(100)
    },
    salary: {
        type: DataTypes.DECIMAL(12, 2)
    },
    profile: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'employees',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
});

export default Employee;