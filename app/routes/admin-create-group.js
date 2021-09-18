const pool = require("../db");

module.exports = (req, res) => {
  const g_name = req.body["g_name"];
  if (!(typeof g_name === "string")) {
    res.sendStatus(400);
    return;
  }

  const gNameIsValid = (gname) => gname.length > 0 && gname.length <= 50;

  if (!gNameIsValid(g_name)) {
    res.status(400).send("GNAME_X");
    return;
  }

  pool.getConnection((err, conn) => {
    if (err) {
      res.sendStatus(500);
      conn.release();
      return;
    }

    conn.query(
      "SELECT * FROM `groups` WHERE g_name = ?",
      [g_name],
      (err, results) => {
        conn.release();
        if (err) {
          res.sendStatus(500);
          return;
        }

        if (results.length !== 0) {
          res.status(400).send("GNAME_DUP");
          return;
        }

        conn.query(
          "INSERT INTO `groups`(g_name) VALUES (?)",
          [g_name],
          (err) => {
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
