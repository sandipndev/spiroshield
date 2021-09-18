const dotenv = require("dotenv");
dotenv.config();

module.exports.APP_PORT = parseInt(process.env.APP_PORT) || 5000;

module.exports.DB_HOST = process.env.DB_HOST || "localhost";
module.exports.DB_PASSWORD = process.env.DB_PASSWORD || "password";
module.exports.DB_USER = process.env.DB_USER || "root";
module.exports.DB_NAME = process.env.DB_NAME || "pdfviewer";

module.exports.ADMIN_PW = process.env.ADMIN_PW || "adminpassword";
module.exports.ADMIN_USER_SKEY = process.env.ADMIN_USER_SKEY || "usersignup";
module.exports.ADMIN_KEY = process.env.ADMIN_KEY || "adminkey";

module.exports.JWT_KEY = process.env.JWT_KEY || "jsonwebtoken-key";
