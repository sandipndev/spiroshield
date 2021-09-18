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
      "SELECT * FROM perms WHERE file_id = ? AND g_id = ?",
      [file_id, g_id],
      (err, results) => {
        if (err) {
          res.sendStatus(500);
          conn.release();
          return;
        }

        if (results.length !== 0) {
          res.status(400).send("DUP");
          conn.release();
          return;
        }

        conn.query(
          "INSERT INTO perms (file_id, g_id) VALUES (?, ?)",
          [file_id, g_id],
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
    );
  });
};
