const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;
const sharp = require("sharp");

exports.register = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const alias = String(req.body.alias || "").trim().toLowerCase();

    if (!email || !password || !alias) {
      return res.status(400).json({ error: "missing_fields" });
    }

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

    const passwordHash = await bcrypt.hash(password, 12);

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

    const user = await User.unscoped().findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "invalid_credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "invalid_credentials" });
    }

    const token = jwt.sign(
      { uid: user.id, alias: user.alias, role: user.role || "user" },
      process.env.JWT_SECRET,
      { expiresIn: "60m" }
    );

    res.json({
      ok: true,
      token,
      id: user.id,
      alias: user.alias,
      email: user.email,
      role: user.role || "user"
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
    const { avatarBase64 } = req.body;
    if (!avatarBase64) {
      return res.status(400).json({ error: "no_data" });
    }

    const user = await db.User.findByPk(req.user.uid);
    if (!user) {
      return res.status(404).json({ error: "not_found" });
    }

    const cleanBase64 = avatarBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(cleanBase64, "base64");

    const optimizedBuffer = await sharp(buffer)
      .resize(256, 256, { fit: "cover" })
      .jpeg({ quality: 80 })
      .toBuffer();

    const finalBase64 =
      "data:image/jpeg;base64," + optimizedBuffer.toString("base64");

    if (finalBase64.length > 100000) {
      return res
        .status(400)
        .json({ error: "too_large_after_compression" });
    }

    user.avatar = finalBase64;
    await user.save();

    res.json({ ok: true, avatar: user.avatar });
  } catch (err) {
    console.error("updateAvatar error:", err);
    res.status(500).json({ error: "server_error" });
  }
};


exports.getUserByAlias = async (req, res) => {
  try {
    const alias = String(req.params.alias || "").trim().toLowerCase();
    if (!alias) {
      return res.status(400).json({ error: "missing_alias" });
    }

    const user = await User.findOne({
      where: { alias },
      attributes: { exclude: ["passwordHash"] },
    });

    if (!user) {
      return res.status(404).json({ error: "user_not_found" });
    }

    res.json(user);
  } catch (err) {
    console.error("getUserByAlias error:", err);
    res.status(500).json({ error: "server_error" });
  }
};


exports.getTopUsuarios = async (req, res) => {
  try {
    const topUsuarios = await db.User.findAll({
      attributes: [
        "id",
        "alias",
        "avatar",
        [
          db.sequelize.literal(`(
            SELECT COUNT(*) 
            FROM messages AS m 
            WHERE m.to = User.id
          )`),
          "totalComentarios",
        ],
      ],
      order: [[db.sequelize.literal("totalComentarios"), "DESC"]],
      limit: 10,
    });

    res.json(topUsuarios);
  } catch (err) {
    console.error("getTopUsuarios error:", err);
    res.status(500).json({ error: err.message || "server_error" });
  }
};


exports.searchUsuarios = async (req, res) => {
  try {
    const q = (req.query.q || "").toLowerCase().trim();
    if (!q) return res.json([]);

    const users = await User.findAll({
      where: db.Sequelize.where(
        db.Sequelize.fn("LOWER", db.Sequelize.col("alias")),
        { [db.Sequelize.Op.like]: `%${q}%` }
      ),
      attributes: [
        "id",
        "alias",
        "avatar",
        "bio",
        [
          db.sequelize.literal(`(
            SELECT COUNT(*) 
            FROM messages AS m 
            WHERE m.to = User.id
          )`),
          "totalComentarios",
        ],
      ],
      order: [[db.sequelize.literal("totalComentarios"), "DESC"]],
      limit: 5,
    });

    res.json(users);
  } catch (err) {
    console.error("searchUsuarios error:", err);
    res.status(500).json({ error: "server_error" });
  }
};
