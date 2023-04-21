const express = require("express");
const router = express.Router();
const createConnection = require("../services/DBConnection");

// Define a GET route
router.get("/", async (req, res) => {
  const con = createConnection();

  con.connect(function (err) {
    if (err) throw err;

    con.query(
      "SELECT * FROM users ORDER BY apodo ASC;",
      function (err, result) {
        if (err) throw err;
        return res.send(result);
      }
    );
  });
});

router.get("/minimal", async (req, res) => {
  const con = createConnection();

  con.connect(function (err) {
    if (err) throw err;

    con.query(
      "SELECT userCode, apodo FROM users ORDER BY apodo ASC;",
      function (err, result) {
        if (err) throw err;
        return res.send(result);
      }
    );
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

router.get("/user-profile-with-image", async (req, res) => {
  const con = createConnection();

  con.connect(function (err) {
    if (err) throw err;
    con.query(
      `SELECT *
      FROM users
      JOIN media ON users.id = media.id
      WHERE userCode = '${req.query.userCode}'`,
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
      `SELECT zkoins, rango, SUM(futbol + ajedrez + pong + panuelo + valorant + pokemon + billar + matar) AS points FROM users WHERE userCode = '${req.query.userCode}'`,
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
        `SELECT apodo, rango, imagen
        SUM(futbol + ajedrez + pong + panuelo + valorant + pokemon + billar + matar) AS points
        FROM users
        JOIN media ON users.id = media.id
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
      `SELECT apodo, userCode, rango, imagen, ${req.query.game} as points FROM users JOIN media ON users.id = media.id ORDER BY points DESC`,
      function (err, result) {
        if (err) throw err;
        return res.send(result);
      }
    );
  });
});

router.get("/with-images", async (req, res) => {
  const con = createConnection();

  con.connect(function (err) {
    if (err) throw err;

    con.query(
      `SELECT users.userCode, users.apodo, media.imagen
        FROM users
        JOIN media ON users.id = media.id
        ORDER BY users.apodo ASC;`,
      function (err, result) {
        if (err) throw err;
        return res.send(result);
      }
    );
    return;
  });
});

router.get("/misions", (req, res) => {
  // SELECT MISIONES AQUI
});

module.exports = router;
