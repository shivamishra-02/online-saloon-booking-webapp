const express = require("express");
const router = express.Router();
const salonController = require("../controllers/salonController");

const { isLoggedIn } = require("../middleware/authMiddleware");

// dashboard
router.get("/dashboard", salonController.getDashboard);

// add salon
router.get("/add", async (req, res) => {
    const salon = await require("../models/Salon").findOne({
        owner: req.session.user._id
    });

    if (salon) {
        return res.redirect("/salon/dashboard");
    }

    res.render("salon/addSalon");
});
router.post("/add", salonController.postAddSalon);

router.get("/:id/add-service", salonController.getAddService);
router.post("/:id/add-service", salonController.postAddService);

router.get("/bookings", salonController.getSalonBookings);



router.get("/dashboard", isLoggedIn, salonController.getDashboard);
router.get("/bookings", isLoggedIn, salonController.getSalonBookings);
router.get("/:id/add-service", isLoggedIn, salonController.getAddService);
router.post("/:id/add-service", isLoggedIn, salonController.postAddService);

module.exports = router;