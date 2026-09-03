import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const verifyUser = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization || !authorization.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const token = authorization.slice(7);
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        
        const user = await User.findById({ _id: decoded._id }).select('-password');
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
}

// Exporting it as authMiddleware so your routes file doesn't break
export { verifyUser as authMiddleware };