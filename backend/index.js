require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// --- CORS ---
const corsOptions = { origin: process.env.CORS_ORIGIN || "http://localhost:8100" };
app.use(cors(corsOptions));

// --- Body parsers ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Rutas principales ---
require("./routes/usuario.routes")(app);
require("./routes/mensaje.routes")(app);
require("./routes/perfil.routes")(app);

// --- Rutas básicas ---
app.get("/status", (_req, res) => res.json({ ok: true }));
app.get("/", (_req, res) =>
  res.json({ message: "Bienvenido a AnonApp" })
);

// --- 404 global ---
app.use((_req, res) => res.status(404).json({ error: "no_encontrado" }));

// --- Configuración ---
const PORT = Number(process.env.PORT || 8080);
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/anonapp";

// --- Arranque ---
(async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(MONGO_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB conectado correctamente.");

    app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));
  } catch (err) {
    console.error("❌ Error conectando a Mongo:", err.message);
    process.exit(1);
  }
})();

// --- Cierre limpio ---
const shutdown = async (code = 0) => {
  try {
    await mongoose.disconnect();
    console.log("🧹 Conexión Mongo cerrada.");
  } finally {
    process.exit(code);
  }
};

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
process.on("unhandledRejection", (e) => {
  console.error("Unhandled Rejection:", e);
  shutdown(1);
});
