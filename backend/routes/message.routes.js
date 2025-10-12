const express = require("express");
const router = express.Router();
const messageCtrl = require("../controllers/message.controller.js");
const auth = require("../middleware/auth.js");


router.get("/", auth, messageCtrl.getReceived);
router.get("/:alias/messages", auth, messageCtrl.getAllForUser);


router.put("/:id/reply", auth, messageCtrl.replyTo);

router.delete("/:id/reject", auth, messageCtrl.reject);
router.delete("/:id/delete", auth, messageCtrl.delete);
router.post("/:id/vote", auth, messageCtrl.vote);

module.exports = router;
