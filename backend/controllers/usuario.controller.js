const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");
const R = require("../resources/es.json");

exports.registrar = async (req, res) => {
  try {
    const correo = String(req.body.correo || "").trim().toLowerCase();
    const clave = String(req.body.clave || "");
    const alias = String(req.body.alias || "").trim().toLowerCase();

    if (!correo || !clave || !alias)
      return res.status(400).json({ error: "faltan_campos" });

    const claveHash = await bcrypt.hash(clave, 12);
    const u = await Usuario.create({ correo, claveHash, alias });

    res.json({ ok: true, id: u._id });
  } catch (e) {
    res.status(409).json({ error: "usuario_duplicado_o_invalido" });
  }
};

exports.login = async (req, res) => {
  const correo = String(req.body.correo || "").trim().toLowerCase();
  const clave = String(req.body.clave || "");

  const u = await Usuario.findOne({ correo }).select("+claveHash");
  if (!u) return res.status(401).json({ error: "credenciales_invalidas" });

  const ok = await bcrypt.compare(clave, u.claveHash);
  if (!ok) return res.status(401).json({ error: "credenciales_invalidas" });

  const token = jwt.sign(
    { uid: u._id, rol: u.rol, alias: u.alias },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  res.json({ ok: true, token });
};

exports.perfilPropio = async (req, res) => {
  const u = await Usuario.findById(req.user.uid).select("-claveHash");
  if (!u) return res.status(404).json({ error: "no_encontrado" });
  res.json(u);
};
