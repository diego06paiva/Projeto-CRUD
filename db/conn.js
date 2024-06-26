const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "127.0.0.1",
  user: "root",
  password: "vasco",
  database: "diego",
  port: 3306,
  charset: "utf8mb4",
});

module.exports = pool;
