const Mensaje = require("../models/mensaje");
const Voto = require("../models/voto");

exports.listarRecibidos = async (req, res) => {
  const mensajes = await Mensaje.find({ para: req.user.uid })
    .populate("de", "alias avatar")
    .sort({ createdAt: -1 });
  res.json(mensajes);
};

exports.responder = async (req, res) => {
  const { cuerpo } = req.body;
  const msg = await Mensaje.findOne({ _id: req.params.id, para: req.user.uid });
  if (!msg) return res.status(404).json({ error: "no_encontrado" });

  msg.respuesta = cuerpo?.trim();
  msg.estado = "respondido";
  msg.visible = true;
  await msg.save();

  res.json({ ok: true, mensaje: msg });
};

exports.rechazar = async (req, res) => {
  const msg = await Mensaje.findOne({ _id: req.params.id, para: req.user.uid });
  if (!msg) return res.status(404).json({ error: "no_encontrado" });

  msg.estado = "rechazado";
  msg.visible = false;
  await msg.save();

  res.json({ ok: true });
};

exports.votar = async (req, res) => {
  const tipo = req.body.tipo === "dislike" ? "dislike" : "like";
  const usuarioId = req.user.uid;
  const mensajeId = req.params.id;

  const existente = await Voto.findOne({ usuarioId, mensajeId });
  if (existente)
    return res.status(400).json({ error: "ya_votado" });

  await Voto.create({ usuarioId, mensajeId, tipo });
  const inc = tipo === "like" ? 1 : -1;
  await Mensaje.updateOne({ _id: mensajeId }, { $inc: { votos: inc } });

  res.json({ ok: true });
};
