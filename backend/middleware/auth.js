const jwt = require("jsonwebtoken");

module.exports = function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "unauthorized" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // attach user info (uid, role, alias)
    next();
  } catch {
    return res.status(401).json({ error: "invalid_token" });
  }
};
