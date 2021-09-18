const mysql = require("mysql");

const { DB_HOST, DB_PASSWORD, DB_USER, DB_NAME } = require("./config");

const pool = mysql.createPool({
  host: DB_HOST,
  password: DB_PASSWORD,
  user: DB_USER,
  database: DB_NAME,
});

pool.getConnection((e) => {
  if (e) throw e;
  console.log("🍕 Database Connected");
});

module.exports = pool;
