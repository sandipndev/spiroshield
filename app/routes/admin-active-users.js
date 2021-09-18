const pool = require("../db");

module.exports = (_, res) => {
  pool.getConnection((err, conn) => {
    if (err) {
      res.sendStatus(500);
      conn.release();
      return;
    }

    conn.query(
      `SELECT users.u_name FROM active_sessions INNER JOIN users 
        ON active_sessions.u_id = users.u_id 
        WHERE active_sessions.timestamp > DATE_SUB(NOW(), INTERVAL 20 MINUTE)`,
      (err, results) => {
        conn.release();
        if (err) {
          res.sendStatus(500);
          return;
        }
        res.status(200).send(JSON.stringify(results));
      }
    );
  });
};
