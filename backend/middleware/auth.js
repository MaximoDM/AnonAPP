const jwt = require("jsonwebtoken");
const R = require("../resources/es.json");

module.exports = function authRequerido(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json(R.ERRORES.NO_AUTORIZADO);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; 
    return next();
  } catch {
    return res.status(401).json(R.ERRORES.TOKEN_INVALIDO);
  }
};
