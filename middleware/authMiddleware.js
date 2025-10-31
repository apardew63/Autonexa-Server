import jwt from 'jsonwebtoken'
import User from '../model/User.js';

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
    try {
        console.log('Authorization header:', req.headers.authorization);
        if (!req.headers.authorization) {
            return res.status(401).json({ success: false, error: "Unauthorized: No token provided" });
        }

        const tokenParts = req.headers.authorization.split(' ');
        console.log('Token parts:', tokenParts);
        if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
            return res.status(400).json({ success: false, error: "Invalid token format" });
        }

        const token = tokenParts[1];
        console.log('Token to verify:', token.substring(0, 20) + '...'); // Log partial token for security
        console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ success: false, error: "Unauthorized: Invalid token" });
        }

        console.log('Decoded token:', { _id: decoded._id, iat: decoded.iat, exp: decoded.exp });
        const user = await User.findById(decoded._id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        console.log('User found:', { _id: user._id, name: user.name, email: user.email });
        req.user = user;
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        console.error("Full error:", error);
        return res.status(500).json({ success: false, error: "Server error: " + error.message });
    }
};

// Middleware to check if user is a dealer
const requireDealer = (req, res, next) => {
    if (req.user.role !== 'dealer') {
        return res.status(403).json({ success: false, error: "Access denied: Dealer role required" });
    }
    next();
};

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, error: "Authentication required" });
    }
    next();
};

export default verifyToken;
export { requireDealer, requireAuth };