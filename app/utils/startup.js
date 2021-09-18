const crypto = require("crypto");

const pool = require("../db");
const { ADMIN_PW, ADMIN_USER_SKEY, ADMIN_KEY } = require("../config");

async function startup() {
  return new Promise((resolve, reject) => {
    // Check if admin is present
    pool.query(`SELECT * FROM misc`, (err, result) => {
      if (err) return reject(err);

      // If row not present, create
      if (result.length === 0) {
        const ADMIN_SALT = crypto.randomBytes(10).toString("hex");
        const ADMIN_HPWORD = crypto
          .createHash("sha256")
          .update(ADMIN_PW + ADMIN_SALT)
          .digest("hex");

        pool.query(
          `INSERT INTO misc(u_signup_key, admin_salt, admin_hpword, admin_key) VALUES (?, ?, ?, ?)`,
          [ADMIN_USER_SKEY, ADMIN_SALT, ADMIN_HPWORD, ADMIN_KEY],
          (err) => {
            if (err) return reject(err);
            resolve();
          }
        );
      } else {
        resolve();
      }
    });
  });
}

module.exports = startup;
