const path = require("path");
const fs = require("fs");

const pool = require("../db");

module.exports = (req, res) => {
  const file_id = req.body["file_id"];

  if (!typeof file_id === "string") {
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
      `SELECT files.file_savedas
        FROM perms
        JOIN files ON files.file_id = perms.file_id
        JOIN users ON perms.g_id = users.u_grpid
        WHERE users.u_id = ? AND files.file_id = ?`,
      [req.user_id, file_id],
      (err, results) => {
        conn.release();
        if (err) {
          res.sendStatus(500);
          return;
        }

        fs.readFile(
          path.join(
            __dirname,
            "..",
            "..",
            "generated",
            results[0]["file_savedas"]
          ),
          (err, data) => {
            if (!err) {
              res.writeHead(200, {
                "Content-Type": "application/zip",
                "Content-disposition": "attachment;filename=" + "file.zip",
                "Content-Length": data.length,
              });
              res.end(Buffer.from(data, "binary"));
            }
          }
        );
      }
    );
  });
};
