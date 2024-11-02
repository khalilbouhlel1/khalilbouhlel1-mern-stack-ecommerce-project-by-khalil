import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    console.log('Auth header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No authentication token, access denied' 
      });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Extracted token:', token);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    if (!decoded.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized as admin' 
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Token verification failed' 
    });
  }
};

export default adminAuth;
