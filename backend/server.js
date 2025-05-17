import express from 'express';
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from 'dotenv';

import propertiesRoutes from './routes/propertiesRoutes.js';
import { sql } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors()); // enable CORS for all routes
app.use(helmet()); // helmet is a security middleware that helps protect your Express apps by setting various HTTP headers
app.use(morgan("dev")); // log the requests to the console

app.use('/api/properties', propertiesRoutes);

async function initDB() {
    try {
        await sql `
            CREATE TABLE IF NOT EXISTS properties (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                property_type VARCHAR(50) NOT NULL,
                address VARCHAR(255) NOT NULL,
                city VARCHAR(100) NOT NULL,
                province VARCHAR(100) NOT NULL,
                price NUMERIC(12, 2) NOT NULL,
                size INTEGER NOT NULL,
                bedrooms INTEGER NOT NULL,
                bathrooms INTEGER NOT NULL,
                status VARCHAR(50) DEFAULT 'available',
                listed_date DATE DEFAULT CURRENT_DATE
            );
        `;
        
        await sql `
            CREATE TABLE IF NOT EXISTS property_images (
                id SERIAL PRIMARY KEY,
                property_id INT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
                image_url TEXT NOT NULL
            );
        `;
        
        await sql `
            CREATE TABLE IF NOT EXISTS amenities (
                property_id INT PRIMARY KEY REFERENCES properties(id) ON DELETE CASCADE,
                gym BOOLEAN DEFAULT FALSE,
                swimming_pool BOOLEAN DEFAULT FALSE,
                parking_lot BOOLEAN DEFAULT FALSE,
                garden BOOLEAN DEFAULT FALSE,
                balcony BOOLEAN DEFAULT FALSE,
                security BOOLEAN DEFAULT FALSE,
                fire_security BOOLEAN DEFAULT FALSE,
                elevator BOOLEAN DEFAULT FALSE,
                commercial_area BOOLEAN DEFAULT FALSE,
                non_flooding BOOLEAN DEFAULT FALSE,
                playground BOOLEAN DEFAULT FALSE,
                common_area BOOLEAN DEFAULT FALSE
            );
        `;

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