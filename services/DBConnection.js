const mysql = require("mysql");

const createConnection = () => {
  return mysql.createConnection({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });
};
module.exports = createConnection;
