const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authenticate = require("../middleware/authmiddleware");

// DELETE: Remove a reported item (Lost/Found)
router.delete("/delete-claim/:id", authenticate, (req, res) => {
  const itemId = req.params.id;
  const userId = req.user.id; // Extracted from token

  const deleteQuery = "DELETE FROM items WHERE id = ? AND reported_by = ?";
  
  db.query(deleteQuery, [itemId, userId], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (result.affectedRows === 0) {
      return res.status(403).json({ error: "Unauthorized or item not found" });
    }

    res.json({ message: "Item deleted successfully" });
  });
});

module.exports = router;
