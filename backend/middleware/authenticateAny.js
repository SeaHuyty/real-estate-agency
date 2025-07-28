import jwt from 'jsonwebtoken'  

const authenticateAny = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if (token == null) {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    
    // Try to verify with user secret first
    jwt.verify(token, process.env.JWT_USER_SECRET, (err, decoded) => {
        if (!err) {
            req.user = decoded;
            req.userType = 'customer';
            return next();
        }
        
        // If user secret fails, try admin secret
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid token" });
            }
            req.user = decoded;
            req.userType = 'admin';
            next();
        });
    });
};

export default authenticateAny;
