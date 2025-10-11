const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../config/db");
const authenticateUser = require("../middleware/authmiddleware"); // Import middleware

const router = express.Router();

// ✅ Configure Multer for image upload
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage });

// ✅ Report Lost Item API
router.post("/report-lost", authenticateUser, upload.single("image"), (req, res) => {
  const { name, description, location } = req.body;
  const reported_by = req.user.id; // Get user ID from middleware
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !location) {
    return res.status(400).json({ error: "Name and location are required" });
  }

  const sql = `INSERT INTO items (name, description, location, category, image_url, reported_by, status) 
               VALUES (?, ?, ?, 'lost', ?, ?, 'pending')`;
  const values = [name, description, location, image_url, reported_by];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });

    res.status(201).json({ message: "Lost item reported successfully!" });
  });
  console.log(req.user)
});

module.exports = router;
