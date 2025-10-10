const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.controller.js");
const auth = require("../middleware/auth.js"); // optional JWT verification

// Public routes
router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);

// Protected routes
router.get("/profile", auth, userCtrl.getProfile);

module.exports = router;
