const mariadb = require("mariadb");

// This should be in a .env file, it's just for testing
const pool = mariadb.createPool({
  host: "localhost",
  user: "your_user",
  password: "your_password",
  database: "your_database",
  connectionLimit: 5,
});

module.export = pool;
