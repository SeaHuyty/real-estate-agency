import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const VisitRequest = sequelize.define('VisitRequest', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    property_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    preferred_date: {
        type: DataTypes.DATEONLY
    },
    status: {
        type: DataTypes.ENUM('pending', 'assigned', 'completed'),
        defaultValue: 'pending'
    },
    assigned_agency_id: {
        type: DataTypes.INTEGER
    },
    notes: {
        type: DataTypes.TEXT
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
}, {
    tableName: 'visit_requests',
    timestamps: false,
    underscored: true
});

export default VisitRequest;