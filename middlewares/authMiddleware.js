const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (context) => {
    if (!context || !context.req) {
        throw new Error("Authentication Error: Context not found.");
    }

    const authHeader = context.req.headers.authorization;
    if (!authHeader) {
        throw new Error("Authorization token is missing");
    }

    const token = authHeader.split(' ')[1]; // Extract token after 'Bearer '
    if (!token) {
        throw new Error("Token is invalid or missing");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded; // Returns user ID and email
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
};

module.exports = authMiddleware;
