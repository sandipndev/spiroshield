const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const pool = require("../db");
const { JWT_KEY } = require("../config");

module.exports = (req, res) => {
  const email = req.body["email"];
  const password = req.body["password"];

  if (!(typeof email === "string" && typeof password === "string")) {
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
      "SELECT * FROM users WHERE u_email = ?",
      [email],
      (err, results) => {
        if (err) {
          res.sendStatus(500);
          conn.release();
          return;
        }

        if (results.length === 0) {
          res.status(400).send("USER_X");
          conn.release();
          return;
        }

        const hpword = crypto
          .createHash("sha256")
          .update(password + results[0]["u_salt"])
          .digest("hex");

        if (hpword !== results[0]["u_hpword"]) {
          res.status(400).send("PWORD_X");
          conn.release();
          return;
        }

        jwt.sign(
          {
            type: "user",
            user_id: results[0]["u_id"],
            user_name: results[0]["u_name"],
          },
          JWT_KEY,
          { expiresIn: "12h" },
          (err, token) => {
            if (err) {
              res.sendStatus(500);
              conn.release();
              return;
            }

            conn.query(
              "INSERT INTO active_sessions(u_id, jwt_token) VALUES (?, ?) ON DUPLICATE KEY UPDATE jwt_token = ?",
              [results[0]["u_id"], token, token],
              (err) => {
                conn.release();
                if (err) {
                  res.sendStatus(500);
                  return;
                }

                res.status(200).send(token);
              }
            );
          }
        );
      }
    );
  });
};
