module.exports = (app) => {
  const express = require("express");
  const authMW = require("../middleware/auth");

  const auth = require("../controllers/auth.controller.js");
  const inbox = require("../controllers/inbox.controller.js");
  const pub = require("../controllers/public.controller.js");
  const msg = require("../controllers/message.controller.js");

  // /auth
  const rAuth = express.Router();
  rAuth.post("/register", auth.register);
  rAuth.post("/login", auth.login);
  app.use("/auth", rAuth);

  // /inboxes
  const rInboxes = express.Router();
  rInboxes.post("/", authMW, inbox.create);
  rInboxes.get("/:id/messages", authMW, inbox.listMessages);
  app.use("/inboxes", rInboxes);

  // público
  const rPublic = express.Router();
  rPublic.get("/i/:slug", pub.getInboxPublic);
  rPublic.post("/i/:slug/messages", pub.postAnonymousMessage);
  app.use("/", rPublic);

  // /messages
  const rMessages = express.Router();
  rMessages.use(authMW);
  rMessages.patch("/:id/read", msg.markRead);
  rMessages.post("/:id/replies", msg.reply);
  app.use("/messages", rMessages);
};
