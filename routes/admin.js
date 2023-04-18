const express = require("express");
const router = express.Router();
const createConnection = require("../services/DBConnection");

router.get("/add", async (req, res) => {
  const con = createConnection();

  con.connect(async (err) => {
    if (err) throw err;

    const isTodos = req.query.userCode === "todos";
    const where = ` WHERE userCode = '${req.query.userCode}';`;
    const col = req.query.type;

    let query = `UPDATE users SET ${col} = ${col} + ${
      req.query.cantidad + (isTodos ? ";" : where)
    }`;

    con.query(query, function (err, result) {
      if (err) throw err;
    });

    const updateRanksQuery = await _updateRanks();

    con.query(updateRanksQuery, function (err, result) {
      if (err) throw err;
      return res.send({
        rows: result.affectedRows,
        user: req.query.userCode,
        type: req.query.type,
      });
    });
  });
});

const _updateRanks = async () => {
  const con = createConnection();

  const users = await new Promise((resolve, reject) => {
    con.query(
      `SELECT userCode, rango, (futbol + ajedrez + pong + panuelo + valorant + pokemon + billar + matar) AS total_points 
      FROM users 
      ORDER BY total_points DESC`,
      function (err, result) {
        if (err) reject(err);
        resolve(result);
      }
    );
  });

  const RANKS = [
    "radiant",
    "immortal",
    "immortal",
    "diamond",
    "diamond",
    "platinum",
    "platinum",
    "platinum",
    "gold",
    "gold",
    "gold",
    "silver",
    "silver",
    "silver",
    "silver",
    "bronze",
    "bronze",
    "bronze",
    "bronze",
    "iron",
    "iron",
    "iron",
    "iron",
    "iron",
    "iron",
  ];

  const orders = Array.from(users).map((user, i) => {
    return {
      ...user,
      rango: RANKS[i],
    };
  });

  const queries = orders.map((user) => {
    return ` UPDATE users SET rango = '${user.rango}' WHERE userCode = '${user.userCode}';`;
  });

  return queries.join("");
};

module.exports = router;
