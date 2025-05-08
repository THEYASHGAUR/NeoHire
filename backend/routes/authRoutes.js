const express = require('express');
const router = express.Router();
const { Signup, Login, LogOut } = require("../controllers/authController.js");

router.post("/login", Login);
router.post("/register", Signup);
router.post("/log-out", LogOut);

module.exports = router;
