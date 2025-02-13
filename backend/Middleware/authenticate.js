const jwt = require('jsonwebtoken');
const User = require('../Models/User'); // Adjust path to import your User model
const Admin = require('../Models/Admin');

const authentication = async (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'Access Denied. No Token Provided.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. Invalid token format.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Separate handling for User and Admin
        let user = null;
        let admin = null;

        if (decoded.userId) {
            user = await User.findByPk(decoded.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
            // Check token validity for user
            if (user.token !== token) {
                return res.status(401).json({ message: 'Access Denied. Invalid or expired token for user.' });
            }
            req.user = { ...decoded, token }; // Attach user details to the request
        }

        if (decoded.adminId) {
            admin = await Admin.findByPk(decoded.adminId);
            if (!admin) {
                return res.status(404).json({ message: 'Admin not found.' });
            }
            // Check token validity for admin
            if (admin.token !== token) {
                return res.status(401).json({ message: 'Access Denied. Invalid or expired token for admin.' });
            }
            req.admin = { ...decoded, token }; // Attach admin details to the request
        }

        // If neither user nor admin was found, return an error
        if (!user && !admin) {
            return res.status(401).json({ message: 'Access Denied. User or Admin credentials required.' });
        }

        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error('JWT verification failed:', err.message);
        return res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = authentication;