const jwt = require("jsonwebtoken");

function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res
        .status(401)
        .json({ error: "unauthorized", message: "Token requerido" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload?.uid) {
      return res
        .status(401)
        .json({ error: "invalid_token", message: "Token inválido o malformado" });
    }

    const role = payload.role || "user";

    req.user = {
      uid: payload.uid,
      role,
      alias: payload.alias || null,
      isAdmin: role === "admin",
    };

    next();
  } catch (err) {
    console.error("auth error:", err.message);
    return res
      .status(401)
      .json({ error: "invalid_token", message: "Token expirado o no válido" });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "admin_only", message: "Solo administradores" });
  }
  next();
}

module.exports = authRequired;

module.exports.requireAdmin = requireAdmin;
