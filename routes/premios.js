const express = require("express");
const router = express.Router();
const createConnection = require("../services/DBConnection");

router.get("/", async (req, res) => {
  const con = createConnection();

  con.connect(function (err) {
    if (err) throw err;

    con.query("SELECT * FROM premios", function (err, result) {
      if (err) throw err;
      return res.send(result);
    });
  });
});

module.exports = router;
