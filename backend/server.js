import express from 'express';
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from 'dotenv';
import propertiesRoutes from './routes/propertiesRoutes.js';
import adminRoutes from './routes/admin/adminRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import userRoutes from './routes/user/userRoutes.js';
import { sql } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors()); // enable CORS for all routes
app.use(helmet()); // helmet is a security middleware that helps protect your Express apps by setting various HTTP headers
app.use(morgan("dev")); // log the requests to the console

app.use('/api/properties', propertiesRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/user', userRoutes);

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
                location_url TEXT NOT NULL,
                price NUMERIC(12, 2) NOT NULL,
                size INTEGER NOT NULL,
                bedrooms INTEGER NOT NULL,
                bathrooms INTEGER NOT NULL,
                property_thumbnail TEXT,
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
        
        await sql `
            CREATE TABLE IF NOT EXISTS admins (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) NOT NULL,
                password VARCHAR(255) NOT NULL,
                isActive BOOLEAN DEFAULT TRUE
            );
        `;

        await sql `
            CREATE TABLE IF NOT EXISTS customers (
                id SERIAL PRIMARY KEY,
                provider VARCHAR(20) NOT NULL DEFAULT 'local',
                password TEXT,
                google_id TEXT UNIQUE,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                phone VARCHAR(20),
                picture TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await sql `
            CREATE TABLE IF NOT EXISTS logs (
                id SERIAL PRIMARY KEY,
                log_time TIMESTAMP DEFAULT NOW(),
                method VARCHAR(10),
                route TEXT,
                ip_address VARCHAR(45)
            );
        `;

        await sql `
            CREATE TABLE IF NOT EXISTS employees (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                phone VARCHAR(20),
                date_of_birth DATE,
                hire_date DATE NOT NULL,
                job_title VARCHAR(100),
                department VARCHAR(100),
                salary NUMERIC(12, 2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                profile TEXT
            );
        `;

        await sql `
            CREATE TABLE IF NOT EXISTS employee_auth (
                employee_id INT PRIMARY KEY REFERENCES employees(id) ON DELETE CASCADE,
                username VARCHAR(100) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await sql `
            CREATE TABLE IF NOT EXISTS visit_requests (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                property_id INTEGER NOT NULL,
                preferred_date DATE,
                status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'completed')),
                assigned_agency_id INTEGER,
                notes TEXT,
                created_at TIMESTAMP DEFAULT NOW()
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