const express = require("express");
const router = express.Router();
const profileCtrl = require("../controllers/profile.controller.js");
const auth = require("../middleware/auth.js");


router.get("/:alias", profileCtrl.getPublicProfile);  

router.post("/:alias/messages", auth, profileCtrl.sendMessage);  

module.exports = router;
