const jwt = require("jsonwebtoken");


module.exports = function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: "unauthorized", message: "Token requerido" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload?.uid) {
      return res.status(401).json({ error: "invalid_token", message: "Token inválido o malformado" });
    }

    req.user = {
      uid: payload.uid,
      role: payload.role || "user",
      alias: payload.alias || null,
    };

    next();
  } catch (err) {
    console.error("auth error:", err.message);
    return res.status(401).json({ error: "invalid_token", message: "Token expirado o no válido" });
  }
};
