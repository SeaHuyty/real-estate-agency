import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Customer = sequelize.define('Customer', {
    provider: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'local'
    },
    password: {
        type: DataTypes.TEXT
    },
    google_id: {
        type: DataTypes.TEXT,
        unique: true
    },
    name: {
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
    picture: {
        type: DataTypes.TEXT
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
}, {
    tableName: 'customers',
    timestamps: false,
    underscored: true
});

export default Customer;