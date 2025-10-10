const crypto = require("crypto");
const db = require("../models");
const User = db.User;
const Message = db.Message;

// Helper: hash sensitive values
function hash(v) {
  return crypto
    .createHash("sha256")
    .update(String(process.env.IP_SALT || "salt") + ":" + String(v || ""))
    .digest("hex")
    .slice(0, 32);
}

// =====================================
// GET /profile/:alias → public feed
// =====================================
exports.feed = async (req, res) => {
  try {
    const alias = req.params.alias.toLowerCase();
    const user = await User.findOne({ where: { alias } });

    if (!user) return res.status(404).json({ error: "user_not_found" });

    const messages = await Message.findAll({
      where: { to: user.id, visible: true },
      include: [
        {
          model: User,
          as: "fromUser",
          attributes: ["alias", "avatar"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      profile: {
        alias: user.alias,
        avatar: user.avatar,
        bio: user.bio,
      },
      messages,
    });
  } catch (err) {
    console.error("feed error:", err);
    res.status(500).json({ error: "server_error" });
  }
};

// =====================================
// POST /profile/:alias/messages → send message (requires login)
// =====================================
exports.sendMessage = async (req, res) => {
  try {
    const alias = req.params.alias.toLowerCase();
    const target = await User.findOne({ where: { alias } });

    if (!target) return res.status(404).json({ error: "target_not_found" });

    const body = String(req.body.body || "").trim();
    if (!body || body.length > 1000)
      return res.status(400).json({ error: "invalid_body" });

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
    const ua = req.headers["user-agent"] || "";
    const ref = req.headers.referer || "";

    await Message.create({
      to: target.id,
      from: req.body.anonymous ? null : req.user.uid,
      body,
      meta_ipHash: hash(ip),
      meta_uaHash: hash(ua),
      meta_ref: ref,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ error: "server_error" });
  }
};
