const jwt = require("jsonwebtoken");

const { JWT_KEY } = require("../config");

module.exports = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];

    jwt.verify(bearerToken, JWT_KEY, (err, authData) => {
      if (err) {
        res.sendStatus(401);
      } else {
        if (authData["type"] !== "admin") res.sendStatus(400);
        else next();
      }
    });
  } else res.sendStatus(401);
};
