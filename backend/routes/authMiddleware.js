const jwt = require('jsonwebtoken');
const User = require('../models/userSchema'); // Assuming you have this model

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Get token from headers

    if (!token) {
        return res.status(401).json({ errors: [{ msg: 'No token provided' }] });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Look up user by ID from decoded token
        const user = await User.findById(decoded.user.id); // Ensure you're accessing the correct user field

        if (!user) {
            return res.status(404).json({ errors: [{ msg: 'User not found' }] });
        }

        req.user = user; // Attach user to the request object

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Auth middleware error:', error);

        // Handle token expiration error specifically
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ errors: [{ msg: 'Token has expired' }] });
        }

        // Handle other JWT errors (invalid token)
        return res.status(401).json({ errors: [{ msg: 'Invalid or expired token' }] });
    }
};

module.exports = authMiddleware;
