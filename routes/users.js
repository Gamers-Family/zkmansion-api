//const pool = require("../services/DBConnection");
const mysql = require("mysql");
const express = require("express");
const router = express.Router();

// Define a GET route
router.get("/users", async (req, res) => {
  const con = mysql.createConnection({
    host: "zkmansion.ddns.net",
    user: "root",
    password: "root",
    database: "zkdatabase",
  });

  con.connect(function (err) {
    if (err) throw err;

    con.query("SELECT * FROM users", function (err, result) {
      if (err) throw err;
      return res.send(result);
    });
  });
});

router.get("/profile", async (req, res) => {
  const con = mysql.createConnection({
    host: "zkmansion.ddns.net",
    user: "root",
    password: "root",
    database: "zkdatabase",
  });

  con.connect(function (err) {
    if (err) throw err;
    con.query(
      `SELECT * FROM users WHERE userCode = '${req.query.userCode}'`,
      function (err, result) {
        if (err) throw err;
        return res.send(result[0]);
      }
    );
  });
});

module.exports = router;
