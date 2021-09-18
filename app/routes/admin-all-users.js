const pool = require("../db");

module.exports = (_, res) => {
  pool.query(
    `SELECT u_id, u_name, u_email, u_grpid FROM users`,
    (err, results) => {
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.status(200).send(JSON.stringify(results));
    }
  );
};
