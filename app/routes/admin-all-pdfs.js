const pool = require("../db");
const state = require("../utils/state");

module.exports = (_, res) => {
  pool.query(`SELECT file_id, file_name FROM files`, (err, results) => {
    if (err) {
      res.sendStatus(500);
      return;
    }

    if (state.processing) {
      results.pop();
    }

    res.status(200).send(JSON.stringify(results));
  });
};
