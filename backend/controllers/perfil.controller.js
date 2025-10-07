const crypto = require("crypto");
const Usuario = require("../models/usuario");
const Mensaje = require("../models/mensaje");

function hash(v) {
  return crypto
    .createHash("sha256")
    .update(String(process.env.IP_SALT || "salt") + ":" + String(v || ""))
    .digest("hex")
    .slice(0, 32);
}

// GET /perfil/:alias → feed público
exports.feed = async (req, res) => {
  const u = await Usuario.findOne({ alias: req.params.alias.toLowerCase() });
  if (!u) return res.status(404).json({ error: "usuario_no_encontrado" });

  const mensajes = await Mensaje.find({ para: u._id, visible: true })
    .populate("de", "alias avatar")
    .sort({ createdAt: -1 });

  res.json({
    perfil: { alias: u.alias, avatar: u.avatar, bio: u.bio },
    mensajes,
  });
};

// POST /perfil/:alias/mensajes → enviar mensaje (requiere login)
exports.enviarMensaje = async (req, res) => {
  const destino = await Usuario.findOne({ alias: req.params.alias.toLowerCase() });
  if (!destino) return res.status(404).json({ error: "destino_no_encontrado" });

  const cuerpo = String(req.body.cuerpo || "").trim();
  if (!cuerpo || cuerpo.length > 1000)
    return res.status(400).json({ error: "cuerpo_invalido" });

  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
  const ua = req.headers["user-agent"] || "";
  const ref = req.headers.referer || "";

  await Mensaje.create({
    para: destino._id,
    de: req.body.anonimo ? null : req.user.uid,
    cuerpo,
    meta: { ipHash: hash(ip), uaHash: hash(ua), ref },
  });

  res.json({ ok: true });
};
