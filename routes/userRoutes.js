const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { isLoggedIn } = require("../middleware/authMiddleware");

// dashboard redirect
router.get("/dashboard", (req, res) => {
    res.redirect("/user/search");
});

// 🔐 protected routes
router.get("/search", isLoggedIn, userController.getSearchPage);
router.post("/search", isLoggedIn, userController.searchSalon);
router.get("/salon/:id", isLoggedIn, userController.getSalonDetails);

// 💰 razorpay
router.post("/create-order", isLoggedIn, userController.createOrder);
router.post("/verify-payment", isLoggedIn, userController.verifyPaymentAndBook);

// booking
router.post("/book", isLoggedIn, userController.bookSlot);
router.get("/bookings", isLoggedIn, userController.getBookings);

module.exports = router;