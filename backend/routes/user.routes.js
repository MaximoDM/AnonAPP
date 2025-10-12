const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.controller.js");
const auth = require("../middleware/auth.js");

router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);

router.get("/profile", auth, userCtrl.getCurrentUser);

router.get("/profile/:alias", auth, userCtrl.getUserByAlias);

router.put("/update", auth, userCtrl.updateUser);

router.post("/avatar", auth, userCtrl.updateAvatar);

module.exports = router;
