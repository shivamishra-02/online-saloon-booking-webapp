const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");


const { isLoggedIn } = require("../middleware/authMiddleware");

// dashboard
router.get("/dashboard", (req, res) => {
    res.redirect("/user/search");
});

// search page
router.get("/search", userController.getSearchPage);
router.post("/search", userController.searchSalon);
router.get("/salon/:id", userController.getSalonDetails);

router.post("/book", userController.bookSlot);
router.get("/bookings", isLoggedIn, userController.getBookings);




router.get("/search", isLoggedIn, userController.getSearchPage);
router.post("/search", isLoggedIn, userController.searchSalon);
router.get("/salon/:id", isLoggedIn, userController.getSalonDetails);
router.post("/book", isLoggedIn, userController.bookSlot);
router.get("/bookings", isLoggedIn, userController.getBookings);

module.exports = router;