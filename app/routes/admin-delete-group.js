const pool = require("../db");

module.exports = (req, res) => {
  const g_id = req.body["g_id"];

  if (typeof g_id !== "string") {
    res.sendStatus(400);
    return;
  }

  pool.getConnection((err, conn) => {
    if (err) {
      res.sendStatus(500);
      conn.release();
      return;
    }

    conn.query("DELETE FROM `groups` WHERE g_id = ?", [g_id], (err) => {
      if (err) {
        res.sendStatus(500);
        conn.release();
        return;
      }

      conn.query("DELETE FROM perms WHERE g_id = ?", [g_id], (err) => {
        if (err) {
          res.sendStatus(500);
          conn.release();
          return;
        }

        conn.query(
          "UPDATE users SET u_grpid = NULL WHERE u_grpid = ?",
          [g_id],
          (err) => {
            conn.release();
            if (err) {
              res.sendStatus(500);
              return;
            }

            res.sendStatus(200);
          }
        );
      });
    });
  });
};
