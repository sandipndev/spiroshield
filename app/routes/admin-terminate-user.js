const pool = require("../db");

module.exports = (req, res) => {
  const u_id = req.body["u_id"];

  if (!typeof u_id === "string") {
    res.sendStatus(400);
    return;
  }

  pool.getConnection((err, conn) => {
    if (err) {
      res.sendStatus(500);
      conn.release();
      return;
    }

    conn.query("DELETE FROM users WHERE u_id = ?", [u_id], (err) => {
      conn.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
};
