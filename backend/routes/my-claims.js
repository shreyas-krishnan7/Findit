const express = require("express");
const db = require("../config/db");
const authenticateUser = require("../middleware/authmiddleware");

const router = express.Router();

// ✅ Get Items Reported by the Logged-in User
router.get("/my-claims", authenticateUser, (req, res) => {
  const userId = req.user.id; // ✅ Extract user ID from token

  const sql = `SELECT * FROM items WHERE reported_by = ? ORDER BY date_reported DESC`;
  
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    res.json(results);
  });
});

module.exports = router;
