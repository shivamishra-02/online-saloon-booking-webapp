const express = require("express");
const router = express.Router();
const salonController = require("../controllers/salonController");

// dashboard
router.get("/dashboard", (req, res) => {
    res.send("Salon Dashboard");
});

// add salon
router.get("/add", salonController.getAddSalon);
router.post("/add", salonController.postAddSalon);

router.get("/:id/add-service", salonController.getAddService);
router.post("/:id/add-service", salonController.postAddService);

module.exports = router;