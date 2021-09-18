const fs = require("fs");
const path = require("path");

const pool = require("../db");

module.exports = (req, res) => {
  pool.query(
    `SELECT file_savedas FROM files WHERE file_id = ?`,
    [req.body["file_id"]],
    (err, results) => {
      if (!err) {
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
    }
  );
};
