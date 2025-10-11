const jwt = require("jsonwebtoken");
const key = "Iam@esKApe"


const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"
  
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token,key); // Replace with your actual secret key
    
    req.user = decoded; // Attach user data to request
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = authenticateUser;
