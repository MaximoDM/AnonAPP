// routes/mensaje.routes.js
const express = require("express");
const router = express.Router();
const mensaje = require("../controllers/mensaje.controller");
const auth = require("../middleware/auth");

// Rutas privadas
router.get("/", auth, mensaje.listarRecibidos);
router.post("/:id/responder", auth, mensaje.responder);
router.delete("/:id/rechazar", auth, mensaje.rechazar);
router.post("/:id/votar", auth, mensaje.votar);

module.exports = (app) => app.use("/mensajes", router);
