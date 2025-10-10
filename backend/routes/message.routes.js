const express = require("express");
const router = express.Router();
const messageCtrl = require("../controllers/message.controller.js");
const auth = require("../middleware/auth.js");

// Private routes
router.get("/", auth, messageCtrl.getReceived);
router.put("/:id/reply", auth, messageCtrl.reply);
router.delete("/:id/reject", auth, messageCtrl.reject);
router.post("/:id/vote", auth, messageCtrl.vote);

module.exports = router;
