const db = require("../models");
const Message = db.Message;
const Vote = db.Vote;
const User = db.User;

// =====================================
// GET /messages/received → list received messages
// =====================================
exports.getReceived = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { to: req.user.uid },
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

// =====================================
// PUT /messages/:id/reply → reply to a message
// =====================================
exports.reply = async (req, res) => {
  try {
    const { body } = req.body;

    const msg = await Message.findOne({
      where: { id: req.params.id, to: req.user.uid },
    });

    if (!msg) return res.status(404).json({ error: "not_found" });

    msg.reply = body?.trim();
    msg.status = "replied";
    msg.visible = true;
    await msg.save();

    res.json({ ok: true, message: msg });
  } catch (err) {
    console.error("reply error:", err);
    res.status(500).json({ error: "server_error" });
  }
};

// =====================================
// PUT /messages/:id/reject → reject a message
// =====================================
exports.reject = async (req, res) => {
  try {
    const msg = await Message.findOne({
      where: { id: req.params.id, to: req.user.uid },
    });

    if (!msg) return res.status(404).json({ error: "not_found" });

    msg.status = "rejected";
    msg.visible = false;
    await msg.save();

    res.json({ ok: true });
  } catch (err) {
    console.error("reject error:", err);
    res.status(500).json({ error: "server_error" });
  }
};

// =====================================
// POST /messages/:id/vote → like or dislike
// =====================================
exports.vote = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const type = req.body.type === "dislike" ? "dislike" : "like";
    const userId = req.user.uid;
    const messageId = req.params.id;

    const existing = await Vote.findOne({ where: { userId, messageId } });
    if (existing) {
      await t.rollback();
      return res.status(400).json({ error: "already_voted" });
    }

    await Vote.create({ userId, messageId, type }, { transaction: t });

    const inc = type === "like" ? 1 : -1;
    await Message.increment("votes", { by: inc, where: { id: messageId }, transaction: t });

    await t.commit();
    res.json({ ok: true });
  } catch (err) {
    await t.rollback();
    console.error("vote error:", err);
    res.status(500).json({ error: "server_error" });
  }
};
