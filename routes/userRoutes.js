const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// dashboard
router.get("/dashboard", (req, res) => {
    res.redirect("/user/search");
});

// search page
router.get("/search", userController.getSearchPage);
router.post("/search", userController.searchSalon);
router.get("/salon/:id", userController.getSalonDetails);

router.post("/book", userController.bookSlot);
router.get("/bookings", userController.getBookings);

module.exports = router;