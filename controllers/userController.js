const Salon = require("../models/Salon");

const Service = require("../models/Service");

const Booking = require("../models/Booking");

// search page
exports.getSearchPage = (req, res) => {
    res.render("user/search", { salons: [] });
};

// search logic
exports.searchSalon = async (req, res) => {
    const { location } = req.body;

    try {
        const salons = await Salon.find({
            location: { $regex: location, $options: "i" }
        });

        res.render("user/search", { salons });

    } catch (err) {
        console.log(err);
        res.send("Error fetching salons");
    }
};



// salon details page
exports.getSalonDetails = async (req, res) => {
    const salonId = req.params.id;

    try {
        const salon = await Salon.findById(salonId);
        const services = await Service.find({ salon: salonId });

        res.render("user/salonDetails", { salon, services });

    } catch (err) {
        console.log(err);
        res.send("Error loading salon");
    }
};



// booking create
exports.bookSlot = async (req, res) => {
    const { serviceId, slot } = req.body;

    try {
        const service = await Service.findById(serviceId);

        const booking = new Booking({
            user: req.session.user._id,
            salon: service.salon,
            service: serviceId,
            slot
        });

        await booking.save();

        res.redirect("/user/bookings");

    } catch (err) {
        console.log(err);
        res.send("Error booking slot");
    }
};

// user bookings
exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.session.user._id })
            .populate("salon")
            .populate("service");

        res.render("user/bookings", { bookings });

    } catch (err) {
        console.log(err);
        res.send("Error fetching bookings");
    }
};