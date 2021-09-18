const jwt = require("jsonwebtoken");

const pool = require("../db");
const { JWT_KEY } = require("../config");

module.exports = function verifyUserToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];

    jwt.verify(bearerToken, JWT_KEY, (err, authData) => {
      if (err) {
        res.sendStatus(401);
      } else {
        if (authData["type"] !== "user") {
          res.sendStatus(400);
          return;
        }
        req.user_id = authData["user_id"];
        req.user_name = authData["user_name"];

        pool.getConnection((err, conn) => {
          if (err) {
            res.sendStatus(500);
            conn.release();
            return;
          }

          conn.query(
            "SELECT * FROM active_sessions WHERE u_id = ? AND jwt_token = ?",
            [authData["user_id"], bearerToken],
            (err, results) => {
              if (err) {
                res.sendStatus(500);
                conn.release();
                return;
              }

              if (results.length === 0) {
                res.sendStatus(400);
                conn.release();
                return;
              }

              conn.query(
                "UPDATE active_sessions SET timestamp = CURRENT_TIMESTAMP WHERE u_id = ?",
                [authData["user_id"]],
                () => {
                  conn.release();
                }
              );

              next();
            }
          );
        });
      }
    });
  } else {
    res.sendStatus(401);
  }
};
