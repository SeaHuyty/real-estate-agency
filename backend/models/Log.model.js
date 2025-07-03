import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Log = sequelize.define('Log', {
    log_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    method: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    route: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true
    }
}, {
    tableName: 'logs',
    underscored: true,
    timestamps: false
});

export default Log;