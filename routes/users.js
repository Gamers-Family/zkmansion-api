const pool = require("../services/DBConnection");
const express = require("express");
const router = express.Router();

// Define a GET route
router.get("/profile", async (req, res) => {
  let conn;
  try {
    // Get a connection from the pool
    conn = await pool.getConnection();

    // Execute the query
    const rows = await conn.query("SELECT * FROM users");

    // Return the results
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  } finally {
    // Release the connection back to the pool
    if (conn) conn.release();
  }
});

module.exports = router;
