const jwt = require('jsonwebtoken');

// Middleware to check if the user is authenticated
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Save the decoded token data (usually contains user ID and role)
        next();  // Call the next middleware/route handler
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

module.exports = authenticateJWT;
