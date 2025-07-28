import jwt from 'jsonwebtoken'

const authenticateUser = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    jwt.verify(token, process.env.JWT_USER_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    message: "Token expired",
                    error: "TOKEN_EXPIRED",
                    expiredAt: err.expiredAt
                });
            }
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = decoded;
        next();
    });
};

export default authenticateUser;
