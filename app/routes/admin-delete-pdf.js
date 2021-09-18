const path = require("path");
const pool = require("../db");
const fs = require("fs");

module.exports = (req, res) => {
  const file_id = req.body["file_id"];

  if (typeof file_id !== "string") {
    res.sendStatus(500);
    return;
  }

  pool.query(
    `SELECT file_savedas FROM files WHERE file_id = ?`,
    [file_id],
    (err, results) => {
      if (err) {
        res.sendStatus(500);
        return;
      }

      fs.unlink(
        path.join(
          __dirname,
          "..",
          "..",
          "generated",
          results[0]["file_savedas"]
        ),
        () => {}
      );

      pool.query(`DELETE FROM files WHERE file_id = ?`, [file_id], (err) => {
        if (err) {
          res.sendStatus(500);
          return;
        }

        pool.query(`DELETE FROM perms WHERE file_id = ?`, [file_id], (err) => {
          if (err) {
            res.sendStatus(500);
            return;
          }

          res.sendStatus(200);
        });
      });
    }
  );
};
