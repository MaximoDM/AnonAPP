// routes/usuario.routes.js
const express = require("express");
const router = express.Router();
const usuario = require("../controllers/usuario.controller");
const auth = require("../middleware/auth");

// Registro y autenticación
router.post("/registrar", usuario.registrar);
router.post("/login", usuario.login);

// Perfil propio (requiere token)
router.get("/me", auth, usuario.perfilPropio);

module.exports = (app) => app.use("/usuarios", router);
