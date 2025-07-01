import express from 'express';
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from 'dotenv';
import propertiesRoutes from './routes/propertiesRoutes.js';
import adminRoutes from './routes/admin/adminRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import userRoutes from './routes/user/userRoutes.js';
import { connectRedis } from './config/redisClient.js';
import sequelize from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

connectRedis();

app.use(express.json());
app.use(cors()); // enable CORS for all routes
app.use(helmet()); // helmet is a security middleware that helps protect your Express apps by setting various HTTP headers
app.use(morgan("dev")); // log the requests to the console

app.use('/api/properties', propertiesRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/user', userRoutes);

const initDB = async () => {
    try {
        // await sequelize.sync({ alter: true });
        console.log('Database initialized successfully');

    } catch (error) {
        console.log('Error initDB:', error);
    }
}

initDB().then(() => {
    app.listen(PORT, () => {
        console.log('Server is running on port ' + PORT);
    })
})