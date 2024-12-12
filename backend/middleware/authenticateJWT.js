const jwt = require('jsonwebtoken');

// Middleware to check if the user is authenticated
const authenticateJWT = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
    }
    
    const token = authHeader.split(' ')[1]; // Extract the token part 

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
    }
    
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Save the decoded token data 
        next();  // Call the next middleware/route handler
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Access Denied: Token Expired!' });
        }
        return res.status(400).json({ message: 'Invalid Token' });
    }
};

module.exports = authenticateJWT;
