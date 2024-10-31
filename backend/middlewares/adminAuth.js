import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided or invalid format",
      });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded.email || decoded.email !== process.env.ADMIN_EMAIL) {
        return res.status(403).json({
          success: false,
          message: "Not authorized as admin",
        });
      }

      req.admin = decoded;
      next();
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  } catch (error) {
    console.error("Admin auth error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during authentication",
    });
  }
};

export default adminAuth;
