require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./models");

const app = express();

// --- CORS ---
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:8100",
};
app.use(cors(corsOptions));

// --- Body parsers ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Database sync ---
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ MySQL connection established.");
    await db.sequelize.sync({ force: false });
    console.log("✅ Database synchronized.");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
})();

// --- Main routes ---
app.use("/users", require("./routes/user.routes.js"));
app.use("/messages", require("./routes/message.routes.js"));
app.use("/profile", require("./routes/profile.routes.js"));

// --- Basic routes ---
app.get("/status", (_req, res) => res.json({ ok: true }));
app.get("/", (_req, res) => res.json({ message: "Welcome to Anonapp" }));

// --- Global 404 ---
app.use((_req, res) => res.status(404).json({ error: "not_found" }));

// --- Server configuration ---
const PORT = Number(process.env.PORT || 8080);

// --- Start server ---
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// --- Graceful shutdown ---
const shutdown = async (code = 0) => {
  try {
    await db.sequelize.close();
    console.log("🧹 MySQL connection closed.");
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
