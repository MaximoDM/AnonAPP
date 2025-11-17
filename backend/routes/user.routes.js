const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.controller.js");
const auth = require("../middleware/auth.js");
const uploadAvatar = require('../middleware/uploadAvatar');


router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);

router.get("/profile", auth, userCtrl.getCurrentUser);

router.get("/profile/:alias", auth, userCtrl.getUserByAlias);

router.put("/update", auth, userCtrl.updateUser);

router.put('/avatar', auth, uploadAvatar.single('avatar'), userCtrl.updateAvatar);

router.get("/top", auth, userCtrl.getTopUsuarios);

router.get('/search', auth, userCtrl.searchUsuarios);

module.exports = router;
