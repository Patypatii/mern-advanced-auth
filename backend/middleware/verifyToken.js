import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) =>{
    const token = req.cookies.token
    if(!token) return res.status(401).json({success: false, message: "Unauthorised - no token provided"});
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if(!decoded) return res.status(401).json({success: false, message: "Unauthorised - invalid token"})
        req.userId = decoded.userId
        next();
    } catch (error) {
        res.status(401).json({success: false, message: "Server error"})
        console.log("Error in verifyingtoken", error);
        
    }
}