const db = require("../models");
const { Op } = require("sequelize");
const Message = db.Message;
const Vote = db.Vote;
const User = db.User;


exports.getReceived = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: {
        to: req.user.uid,
        status: { [Op.ne]: "rejected" }, // evita mostrar mensajes descartados
      },
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

    res.json(messages);
  } catch (err) {
    console.error("getReceived error:", err);
    res.status(500).json({ error: "server_error" });
  }
};

exports.getAllForUser = async (req, res) => {
  try {

    console.log('getAllForUser llamado con alias:', req.params.alias);
    const alias = req.params.alias?.toLowerCase();
    if (!alias) return res.status(400).json({ error: "missing_alias" });
    const user = await User.findOne({ where: { alias } });
    if (!user) return res.status(404).json({ error: "user_not_found" });

    const messages = await Message.findAll({
      where: { to: user.id, status: { [Op.ne]: "rejected" } },
      order: [["createdAt", "DESC"]],
    });

    res.json(messages);
  } catch (err) {
    console.error("getAllForUser error:", err);
    res.status(500).json({ error: "server_error" });
  }
};

exports.replyTo = async (req, res) => {
  try {
    const replyText = String(req.body.body || "").trim();

    if (!replyText || replyText.length > 2000) {
      return res.status(400).json({ error: "invalid_reply" });
    }

    const msg = await Message.findOne({
      where: { id: req.params.id, to: req.user.uid },
    });

    if (!msg) {
      return res.status(404).json({ error: "not_found" });
    }

    await msg.update({
      reply: replyText,
      status: "replied",
      visible: true, 
      repliedAt: new Date(),
    });

    res.json({ ok: true, message: msg });
  } catch (err) {
    console.error("replyTo error:", err);
    res.status(500).json({ error: "server_error" });
  }
};


exports.reject = async (req, res) => {
  try {
    const msg = await Message.findOne({
      where: { id: req.params.id, to: req.user.uid },
    });

    if (!msg) {
      return res.status(404).json({ error: "not_found" });
    }

    await msg.update({
      status: "rejected",
      visible: false,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("reject error:", err);
    res.status(500).json({ error: "server_error" });
  }
};

exports.delete = async (req, res) => {
  try {
    const msg = await Message.findOne({
      where: { id: req.params.id, to: req.user.uid },
    });
    if (!msg) {
      return res.status(404).json({ error: "not_found" });
    }
    await msg.destroy();
    res.json({ ok: true });
  } catch (err) {
    console.error("delete error:", err);
    res.status(500).json({ error: "server_error" });
  }
};

exports.vote = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const type = req.body.type === "dislike" ? "dislike" : "like";
    const userId = req.user.uid;
    const messageId = req.params.id;

    const targetMsg = await Message.findByPk(messageId);
    if (targetMsg && targetMsg.to === userId) {
      await t.rollback();
      return res.status(403).json({ error: "cannot_vote_own_message" });
    }

    const existing = await Vote.findOne({ where: { userId, messageId } });
    if (existing) {
      await t.rollback();
      return res.status(400).json({ error: "already_voted" });
    }

    await Vote.create({ userId, messageId, type }, { transaction: t });

    const incrementBy = type === "like" ? 1 : -1;
    await Message.increment("votes", {
      by: incrementBy,
      where: { id: messageId },
      transaction: t,
    });

    await t.commit();
    res.json({ ok: true });
  } catch (err) {
    await t.rollback();
    console.error("vote error:", err);
    res.status(500).json({ error: "server_error" });
  }
};
