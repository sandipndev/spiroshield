const pool = require("../db");
const crypto = require("crypto");

module.exports = (req, res) => {
  const u_name = req.body["name"];
  const u_email = req.body["email"];
  const u_pass = req.body["password"];
  const u_signup_key = req.body["user_signup_key"];

  if (
    !(
      typeof u_name === "string" &&
      typeof u_email === "string" &&
      typeof u_pass === "string" &&
      typeof u_signup_key === "string"
    )
  ) {
    res.sendStatus(400);
    return;
  }

  const nameIsValid = (name) => name.length > 0 && name.length <= 50;
  const emailIsValid = (email) =>
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g.test(
      email
    ) && email.length <= 100;
  const passwordIsValid = (password) =>
    /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/g.test(
      password
    );

  if (
    !(
      nameIsValid(u_name) &&
      emailIsValid(u_email) &&
      passwordIsValid(u_pass) &&
      nameIsValid(u_signup_key)
    )
  ) {
    res.sendStatus(400);
    return;
  }

  pool.getConnection((err, conn) => {
    if (err) {
      res.sendStatus(500);
      return;
    }

    conn.query("SELECT u_signup_key FROM misc", (err, results) => {
      if (err) {
        res.sendStatus(500);
        conn.release();
        return;
      }

      if (results[0]["u_signup_key"] !== u_signup_key) {
        res.status(400).send("KEY_ERR");
        conn.release();
        return;
      }

      conn.query(
        "SELECT * FROM users WHERE u_email = ?",
        [u_email],
        (err, results) => {
          if (err) {
            res.sendStatus(500);
            conn.release();
            return;
          }

          if (results.length !== 0) {
            res.status(400).send("EMAIL_EXISTS");
            conn.release();
            return;
          }

          const salt = crypto.randomBytes(10).toString("hex");
          const saltedhpword = crypto
            .createHash("sha256")
            .update(u_pass + salt)
            .digest("hex");

          conn.query(
            "INSERT INTO users (u_name, u_email, u_salt, u_hpword) VALUES (?, ?, ?, ?)",
            [u_name, u_email, salt, saltedhpword],
            (err) => {
              conn.release();
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
  });
};
