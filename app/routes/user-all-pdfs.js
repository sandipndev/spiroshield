const pool = require("../db");

module.exports = (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) {
      res.sendStatus(500);
      conn.release();
      return;
    }

    conn.query(
      `SELECT files.file_id, files.file_name 
      FROM perms
      JOIN files ON files.file_id = perms.file_id
      JOIN users ON perms.g_id = users.u_grpid
      WHERE users.u_id = ?`,
      [req.user_id],
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
