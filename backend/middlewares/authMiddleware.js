import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

export const checkAuth = async (req, res, next) => {
  try {
    // Try to get token from cookie first, then from Authorization header
    let token = req.cookies.jwt;
    
    if (!token) {
      // Check Authorization header (for localStorage/cross-domain)
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7); // Remove "Bearer " prefix
      }
    }
    
    if (!token) {
      return res.status(400).json({ message: "token is required." });
    }
    
    const secret = process.env.JWT_SECRET || process.env.secretkey;
    const decode = jwt.verify(token, secret);
    if (!decode) {
      return res.status(401).json({ message: "unauthorised-invalid token" });
    }
    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("error in checkAuth middleware", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};
