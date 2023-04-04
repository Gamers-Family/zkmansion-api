const mariadb = require("mariadb");

// This should be in a .env file, it's just for testing
const pool = mariadb.createPool({
  host: "zkmansion.ddns.net",
  port: 3306,
  user: "root",
  password: "root",
  database: "zkdatabase",
  connectionLimit: 30,
});

module.export = pool;
