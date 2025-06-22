import { sql } from '../config/db.js';

const log = async (req, res, next) => {
    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const { method, originalUrl } = req;
    
        await sql `
            INSERT INTO logs (method, route, ip_address)
            VALUES (${method}, ${originalUrl}, ${ip});
        `;
    } catch (error) {
        console.error('Log middleware error:', error);
    }

    next();
};

export default log;