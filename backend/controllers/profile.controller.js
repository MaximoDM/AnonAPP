const db = require("../models");
const { Op } = require("sequelize");
const User = db.User;
const Message = db.Message;


exports.getPublicProfile = async (req, res) => {
  try {
    const alias = req.params.alias?.toLowerCase();
    if (!alias) return res.status(400).json({ error: "missing_alias" });
    const user = await User.findOne({
      where: { alias },
      attributes: ["id", "alias", "avatar", "bio", "createdAt"],
    });

    if (!user) return res.status(404).json({ error: "user_not_found" });

    const messages = await Message.findAll({
      where: {
        to: user.id,
        visible: true,
        reply: { [Op.ne]: null },
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

    

    res.json({
      profile: {
        alias: user.alias,
        avatar: user.avatar || "assets/default-avatar.png",
        bio: user.bio || "Sin biografía",
        createdAt: user.createdAt,
      },
      feed: messages,
    });

    console.log('Perfil público obtenido para alias:', alias);
    console.log('Datos del perfil:', {
      alias: user.alias,
      avatar: user.avatar || "assets/default-avatar.png",
      bio: user.bio || "Sin biografía",
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error("getPublicProfile error:", err);
    res.status(500).json({ error: "server_error" });
  }
};


exports.sendMessage = async (req, res) => {
  try {
    const alias = req.params.alias?.toLowerCase();
    if (!alias) return res.status(400).json({ error: "missing_alias" });

    const target = await User.findOne({ where: { alias } });
    if (!target) return res.status(404).json({ error: "target_not_found" });

    const body = String(req.body.body || "").trim();
    if (!body || body.length > 1000)
      return res.status(400).json({ error: "invalid_body" });

    const fromId = req.user.uid; 
    const isAnon = !!req.body.anonymous; 

    await Message.create({
      to: target.id,
      from: fromId,         
      body,
      isAnonymous: isAnon,  
      visible: false,       
    });

    res.json({ ok: true, sentTo: alias, anonymous: isAnon });
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ error: "server_error" });
  }
};

