const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization; // as headers is header = { ..... , authorization:bearer token, .... }

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.user = decoded; 
            
            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token. You are forbidden.'
            });
        }
    } else {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }
};

module.exports = verifyToken;