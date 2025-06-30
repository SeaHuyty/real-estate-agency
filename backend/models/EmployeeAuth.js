import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const EmployeeAuth = sequelize.define('EmployeeAuth', {
    employee_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
        model: 'employees',
        key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    tableName: 'employee_auth',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
});

export default EmployeeAuth;