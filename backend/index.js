require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models");

const app = express();

app.use(
  cors()
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Database connection established.");
    await db.sequelize.sync({ alter: false });
    console.log("Models synchronized.");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
})();

app.use("/api/users", require("./routes/user.routes"));
app.use("/api/messages", require("./routes/message.routes"));
app.use("/api/profile", require("./routes/profile.routes"));

app.get("/api/status", (_req, res) => res.json({ ok: true }));
app.get("/ping", (_req, res) => res.send("pong"));
app.get("/", (_req, res) => res.json({ message: "Welcome to AnonApp API" }));

app.use((_req, res) => res.status(404).json({ error: "not_found" }));

const PORT = Number(process.env.PORT) || 8080;
const HOST = "0.0.0.0";

app.listen(process.env.PORT || 8080)


const shutdown = async (code = 0) => {
  console.log("Shutting down server...");
  server.close(async () => {
    try {
      await db.sequelize.close();
      console.log("Database connection closed.");
      process.exit(code);
    } catch (err) {
      console.error("Error during shutdown:", err.message);
      process.exit(1);
    }
  });
};

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
process.on("unhandledRejection", (e) => {
  console.error("Unhandled Rejection:", e);
  shutdown(1);
});
