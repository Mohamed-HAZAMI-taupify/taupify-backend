const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "pas de token, authorization refusée" });
  }
  try {
    const decoded = jwt.verify(token, "everestsecrettoken");

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "token invalide" });
  }
};
