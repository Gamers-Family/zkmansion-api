module.exports = (req, res) => {
  var mysql = require("mysql");

  var con = mysql.createConnection({
    host: "zkmansion.ddns.net",
    user: "root",
    password: "root",
    database: "zkdatabase",
  });

  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "SELECT * FROM users";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Response Loaded");
      // console.log(result);
      return res.send(result);
    });
  });
};
