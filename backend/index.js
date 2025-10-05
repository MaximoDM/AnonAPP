require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// CORS
const corsOptions = { origin: "http://localhost:8100" };
app.use(cors(corsOptions));

// Body parsers
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true }));

// Rutas básicas
app.get("/status", (_req, res) => res.json({ ok: true }));
app.get("/", (_req, res) =>
  res.json({ message: "Bienvenido a la app que no se me ocurre que poner" })
);

// 404
app.use((_req, res) => res.status(404).json({ error: "not_found" }));

// Config
const PORT = Number(process.env.PORT || 8080);
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/moodanon";

// Arranque
(async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(MONGO_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Mongo conectado");

    app.listen(PORT, () => console.log(`Server en puerto ${PORT}`));
  } catch (err) {
    console.error("Error conectando a Mongo:", err.message);
    process.exit(1);
  }
})();

const shutdown = async (code = 0) => {
  try {
    await mongoose.disconnect();
  } finally {
    process.exit(code);
  }
};
process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
process.on("unhandledRejection", (e) => {
  console.error("unhandledRejection:", e);
  shutdown(1);
});
