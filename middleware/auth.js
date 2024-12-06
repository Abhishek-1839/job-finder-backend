const jwt = require("jsonwebtoken");
const env = require("dotenv");
env.config();
const isLoggedIn = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: "Invalid token" });
    } else {
      req.user = decoded;
      next();
    }
  });
};

module.exports = { isLoggedIn };
