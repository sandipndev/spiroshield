const pool = require("../db");
const crypto = require("crypto");

module.exports = (req, res) => {
  if (req.body.type === "change") {
    const newUSignupKey = crypto.randomBytes(5).toString("hex");

    pool.query(`UPDATE misc SET u_signup_key = ?`, [newUSignupKey], (err) => {
      if (err) {
        res.sendStatus(500);
        return;
      }

      res.status(200).send(newUSignupKey);
    });
  } else {
    pool.query("SELECT u_signup_key FROM misc", (err, results) => {
      if (err) {
        res.sendStatus(500);
        return;
      }

      res.status(200).send(results[0]["u_signup_key"]);
    });
  }
};
