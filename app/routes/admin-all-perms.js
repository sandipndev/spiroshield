const pool = require("../db");

module.exports = (_, res) => {
  pool.getConnection((err, conn) => {
    if (err) {
      res.sendStatus(500);
      conn.release();
      return;
    }

    conn.query(
      `SELECT files.file_name, files.file_id, groups.g_id, groups.g_name FROM perms 
        JOIN files ON perms.file_id = files.file_id
        JOIN \`groups\` ON perms.g_id = groups.g_id`,
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
