const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Signup
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

// Login
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

// Logout
router.get("/logout", authController.logout);

module.exports = router;