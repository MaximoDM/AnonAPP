const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;


exports.register = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const alias = String(req.body.alias || "").trim().toLowerCase();

    if (!email || !password || !alias) {
      return res.status(400).json({ error: "missing_fields" });
    }

    // Verificar si ya existe usuario con ese correo o alias
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "user_already_exists" });
    }

    const existingAlias = await User.findOne({ where: { alias } });
    if (existingAlias) {
      return res.status(409).json({ error: "alias_already_exists" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "weak_password" });
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 12);

    // Crear usuario
    const user = await User.create({
      email,
      alias,
      passwordHash,
      avatar: null,
      bio: "Me siento calmo, casi diría ecuánime.",
      role: "user"
    });

    res.json({ ok: true, id: user.id, alias: user.alias });
  } catch (err) {
    console.error("register error:", err);
    res.status(500).json({ error: "server_error" });
  }
};


exports.login = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    const user = await User.unscoped().findOne({ where: { email } }); // incluye passwordHash
    if (!user) {
      return res.status(401).json({ error: "invalid_credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "invalid_credentials" });
    }

    const token = jwt.sign(
      { uid: user.id, alias: user.alias, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({
      ok: true,
      token,
      id: user.id,
      alias: user.alias,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ error: "server_error" });
  }
};


exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.uid, {
      attributes: { exclude: ["passwordHash"] },
    });

    if (!user) {
      return res.status(404).json({ error: "not_found" });
    }

    res.json(user);
  } catch (err) {
    console.error("getCurrentUser error:", err);
    res.status(500).json({ error: "server_error" });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { bio, avatar, alias } = req.body;
    const user = await User.findByPk(req.user.uid);

    if (!user) {
      return res.status(404).json({ error: "not_found" });
    }

    await user.update({
      bio: bio ?? user.bio,
      avatar: avatar ?? user.avatar,
      alias: alias ?? user.alias,
    });

    res.json({ ok: true, updated: true });
  } catch (err) {
    console.error("updateUser error:", err);
    res.status(500).json({ error: "server_error" });
  }
};


exports.updateAvatar = async (req, res) => {
  try {
    res.status(501).json({ error: "not_implemented" });
  } catch (err) {
    console.error("updateAvatar error:", err);
    res.status(500).json({ error: "server_error" });
  }
};

exports.getUserByAlias = async (req, res) => {
  try {
    const alias = String(req.params.alias || "").trim().toLowerCase();
    if (!alias) return res.status(400).json({ error: "missing_alias" });
    const user = await User.findOne({ where: { alias }, attributes: { exclude: ["passwordHash"] } });
    if (!user) return res.status(404).json({ error: "user_not_found" });
    res.json( user );
  } catch (err) {
    console.error("getUserByAlias error:", err);
    res.status(500).json({ error: "server_error" });
  }
};
