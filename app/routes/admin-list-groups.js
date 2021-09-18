const pool = require("../db");

module.exports = (_, res) => {
  pool.getConnection((err, conn) => {
    if (err) {
      res.sendStatus(500);
      conn.release();
      return;
    }

    conn.query("SELECT * FROM `groups`", (err, results) => {
      conn.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.status(200).send(JSON.stringify(results));
    });
  });
};
