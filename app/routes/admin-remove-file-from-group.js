const pool = require("../db");

module.exports = (req, res) => {
  const g_id = req.body["g_id"];
  const file_id = req.body["file_id"];

  if (!(typeof g_id === "string" && typeof file_id === "string")) {
    res.sendStatus(400);
    return;
  }

  pool.getConnection((err, conn) => {
    if (err) {
      res.sendStatus(500);
      conn.release();
      return;
    }

    conn.query(
      `DELETE FROM perms WHERE g_id = ? AND file_id = ?`,
      [g_id, file_id],
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
};
