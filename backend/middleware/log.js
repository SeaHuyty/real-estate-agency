import Log from "../models/Log.model.js";

const log = async (req, res, next) => {
    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const { method, originalUrl } = req;
    
        await Log.create({
            method: method,
            route: originalUrl,
            ip_address: ip
        });

    } catch (error) {
        console.error('Log middleware error:', error);
    }

    next();
};

export default log;