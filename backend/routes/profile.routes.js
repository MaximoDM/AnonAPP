const express = require("express");
const router = express.Router();
const profileCtrl = require("../controllers/profile.controller.js");
const auth = require("../middleware/auth.js");

// Public profile feed (no authentication required)
router.get("/:alias", profileCtrl.feed);

// Send a message to a profile (requires login)
router.post("/:alias/messages", auth, profileCtrl.sendMessage);

module.exports = router;
