const pool = require("../db");

module.exports = (req, res) => {
  const g_id = req.body["g_id"];
  const u_id = req.body["u_id"];

  if (!(typeof g_id === "string" && typeof u_id === "string")) {
    res.sendStatus(400);
    return;
  }

  pool.getConnection((err, conn) => {
    if (err) {
      res.sendStatus(500);
      conn.release();
      return;
    }

    if (g_id === "null") {
      conn.query(
        "UPDATE users SET u_grpid = NULL WHERE u_id = ?",
        [g_id, u_id],
        (err) => {
          conn.release();
          if (err) {
            res.sendStatus(500);
            return;
          }
          res.sendStatus(200);
        }
      );
    } else {
      conn.query(
        "UPDATE users SET u_grpid = ? WHERE u_id = ?",
        [g_id, u_id],
        (err) => {
          conn.release();
          if (err) {
            res.sendStatus(500);
            return;
          }
          res.sendStatus(200);
        }
      );
    }
  });
};
