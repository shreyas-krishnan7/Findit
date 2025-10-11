const express = require("express");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken"); // Required for decoding token
const db = require("../config/db");
const router = express.Router();
const key = "Iam@esKApe"

// ✅ Configure Multer for image upload
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage });

// ✅ Middleware to extract user ID from token
const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");
  console.log(token)
  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token,key); // Secret from .env file
    req.user = decoded; // Attach user data to request
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

// ✅ Report Found Item API
router.post("/report-found", authenticateUser, upload.single("image"), (req, res) => {
  const { name, description, location } = req.body;
  const reported_by = req.user.id; // Extract user ID from decoded token
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  // Validate input
  if (!name || !location) {
    return res.status(400).json({ error: "Name and location are required" });
  }

  const sql = `INSERT INTO items (name, description, location, category, image_url, reported_by, status) 
               VALUES (?, ?, ?, 'found', ?, ?, 'pending')`;
  const values = [name, description, location, image_url, reported_by];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });

    res.status(201).json({ message: "Found item reported successfully!" });
  });
});

module.exports = router;
