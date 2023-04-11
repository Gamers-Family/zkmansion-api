const express = require("express");
const router = express.Router();
const createConnection = require("../services/DBConnection");

// Define a GET route
router.get("/", async (req, res) => {
  const con = createConnection();

  con.connect(function (err) {
    if (err) throw err;

    con.query("SELECT * FROM users", function (err, result) {
      if (err) throw err;
      return res.send(result);
    });
  });
});

router.get("/minimal", async (req, res) => {
  const con = createConnection();

  con.connect(function (err) {
    if (err) throw err;

    con.query("SELECT userCode, apodo FROM users", function (err, result) {
      if (err) throw err;
      return res.send(result);
    });
  });
});

router.get("/user-profile", async (req, res) => {
  const con = createConnection();

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

router.get("/user-zkoins-points", async (req, res) => {
  const con = createConnection();

  con.connect(function (err) {
    if (err) throw err;
    con.query(
      `SELECT zkoins, points FROM users WHERE userCode = '${req.query.userCode}'`,
      function (err, result) {
        if (err) throw err;
        return res.send(result[0]);
      }
    );
  });
});

router.get("/ranking", async (req, res) => {
  const con = createConnection();

  con.connect(function (err) {
    if (err) throw err;

    if (req.query.game === "global") {
      con.query(
        `SELECT apodo, rango, foto,
        SUM(futbol + ajedrez + pingpong + panuelo + valorant + pokemon + billar + matar) AS points
        FROM users
        GROUP BY apodo
        ORDER BY points DESC`,
        function (err, result) {
          if (err) throw err;
          return res.send(result);
        }
      );
      return;
    }

    con.query(
      `SELECT apodo, userCode, rango, foto, ${req.query.game} as points FROM users ORDER BY points DESC`,
      function (err, result) {
        if (err) throw err;
        return res.send(result);
      }
    );
  });
});

module.exports = router;
