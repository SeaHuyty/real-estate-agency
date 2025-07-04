import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

// Sequelize initialization using environment variables
const sequelize = new Sequelize(
    `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`, 
    {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            }
        },
        logging: false
    }
);

export default sequelize;