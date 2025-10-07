// routes/perfil.routes.js
const express = require("express");
const router = express.Router();
const perfil = require("../controllers/perfil.controller");
const auth = require("../middleware/auth");

// Feed público (no requiere autenticación)
router.get("/:alias", perfil.feed);

// Enviar mensaje a un perfil (requiere login)
router.post("/:alias/mensajes", auth, perfil.enviarMensaje);

module.exports = (app) => app.use("/perfil", router);
