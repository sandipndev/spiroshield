const pool = require("../db");
const crypto = require("crypto");

module.exports = (req, res) => {
  if (req.body["oldPassword"] === "") {
    res.status(400).send(
      JSON.stringify({
        field: "oldPassword",
        msg: "Password can't be empty",
      })
    );
    return;
  }

  if (req.body["newPassword"] === "") {
    res.status(400).send(
      JSON.stringify({
        field: "newPassword",
        msg: "Password can't be empty",
      })
    );
    return;
  }

  var strongRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );

  if (!strongRegex.test(req.body["newPassword"])) {
    res.status(400).send(
      JSON.stringify({
        field: "newPassword",
        msg:
          "Admin Password must contain atleast 1 lowercase, 1 uppercase, 1 number and a special character",
      })
    );
    return;
  }

  if (req.body["retypeNewPassword"] === "") {
    res.status(400).send(
      JSON.stringify({
        field: "retypeNewPassword",
        msg: "Password can't be empty",
      })
    );
    return;
  }

  if (req.body["retypeNewPassword"] !== req.body["newPassword"]) {
    res.status(400).send(
      JSON.stringify({
        field: "retypeNewPassword",
        msg: "Passwords do not match",
      })
    );
    return;
  }

  pool.query(`SELECT admin_salt, admin_hpword FROM misc`, (err, results) => {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const saltedpword = req.body["oldPassword"] + results[0]["admin_salt"];
    const hash = crypto.createHash("sha256").update(saltedpword).digest("hex");

    if (hash !== results[0]["admin_hpword"]) {
      res.status(400).send({
        field: "oldPassword",
        msg: "Wrong Password",
      });
      return;
    }

    const newSalt = crypto.randomBytes(10).toString("hex");
    const newSaltedPassword = req.body["newPassword"] + newSalt;
    const newHash = crypto
      .createHash("sha256")
      .update(newSaltedPassword)
      .digest("hex");

    pool.query(
      `UPDATE misc SET admin_salt = ?, admin_hpword = ? WHERE admin_salt = ?`,
      [newSalt, newHash, results[0]["admin_salt"]],
      (err) => {
        if (err) {
          res.sendStatus(500);
          return;
        }
        res.sendStatus(200);
      }
    );
  });
};
