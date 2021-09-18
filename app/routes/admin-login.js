const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const pool = require("../db");
const { JWT_KEY } = require("../config");

module.exports = (req, res) => {
  if (req.body["username"] !== "admin") {
    res.status(400).send("UNAME_ERR");
    return;
  }

  pool.query(
    `SELECT admin_salt, admin_hpword, admin_key FROM misc`,
    (err, result) => {
      if (err) {
        res.sendStatus(500);
        return;
      }

      if (result[0]["admin_key"] !== req.body["adminKey"]) {
        res.status(400).send("KEY_ERR");
        return;
      }

      const saltedpword = req.body["password"] + result[0]["admin_salt"];
      const hash = crypto
        .createHash("sha256")
        .update(saltedpword)
        .digest("hex");

      if (hash !== result[0]["admin_hpword"]) {
        res.status(400).send("PWORD_ERR");
        return;
      }

      jwt.sign({ type: "admin" }, JWT_KEY, { expiresIn: "12h" }, (_, token) => {
        res.status(200).send(token);
      });
    }
  );
};
