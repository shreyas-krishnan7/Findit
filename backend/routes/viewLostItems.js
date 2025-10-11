const express = require("express");
const db = require("../config/db"); 
const router = express.Router();

// ✅ Get all lost items
router.get("/lost-items", (req, res) => {
    const sql = `
      SELECT items.*, users.name AS reported_by_name, users.email AS reported_by_email 
      FROM items 
      JOIN users ON items.reported_by = users.id
      WHERE category = 'lost' 
      ORDER BY date_reported DESC
    `;
  
    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(results);
    });
  });
  

  module.exports = router;