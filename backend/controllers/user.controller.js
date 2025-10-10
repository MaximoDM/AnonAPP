const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;

// ===========================
//  Register new user
// ===========================
exports.register = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const alias = String(req.body.alias || "").trim().toLowerCase();

    if (!email || !password || !alias) {
      return res.status(400).json({ error: "missing_fields" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({ email, passwordHash, alias });

    res.json({ ok: true, id: user.id });
  } catch (err) {
    console.error("register error:", err);
    res.status(409).json({ error: "user_already_exists_or_invalid" });
  }
};

// ===========================
//  Login
// ===========================
exports.login = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    const user = await User.unscoped().findOne({ where: { email } }); // include passwordHash
    if (!user) {
      return res.status(401).json({ error: "invalid_credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "invalid_credentials" });
    }

    const token = jwt.sign(
      { uid: user.id, role: user.role, alias: user.alias },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ ok: true, token });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ error: "server_error" });
  }
};

// ===========================
//  Get own profile
// ===========================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.uid, {
      attributes: { exclude: ["passwordHash"] },
    });
    if (!user) {
      return res.status(404).json({ error: "not_found" });
    }

    res.json(user);
  } catch (err) {
    console.error("getProfile error:", err);
    res.status(500).json({ error: "server_error" });
  }
};
