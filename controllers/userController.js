const Salon = require("../models/Salon");
const Service = require("../models/Service");
const Booking = require("../models/Booking");
const razorpay = require("../config/razorpay");

// ================= SEARCH =================

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

// ================= SALON DETAILS =================

exports.getSalonDetails = async (req, res) => {
    const salonId = req.params.id;

    try {
        const salon = await Salon.findById(salonId);
        const services = await Service.find({ salon: salonId });

        const bookings = await Booking.find({ salon: salonId });

        res.render("user/salonDetails", {
            salon,
            services,
            bookings
        });

    } catch (err) {
        console.log(err);
        res.send("Error loading salon");
    }
};

// ================= RAZORPAY =================

// create order
exports.createOrder = async (req, res) => {
    const { serviceId } = req.body;

    try {
        const service = await Service.findById(serviceId);

        const options = {
            amount: service.price * 100,
            currency: "INR",
            receipt: "receipt_" + Date.now()
        };

        const order = await razorpay.orders.create(options);

        res.json({
            orderId: order.id,
            amount: options.amount,
            key: process.env.RAZORPAY_KEY_ID
        });

    } catch (err) {
        console.log(err);
        res.status(500).send("Error creating order");
    }
};

// verify payment + book slot
exports.verifyPaymentAndBook = async (req, res) => {
    const { serviceId, slot } = req.body;

    try {
        const service = await Service.findById(serviceId);

        // double booking check
        const existing = await Booking.findOne({
            service: serviceId,
            slot
        });

        if (existing) {
            return res.send("Slot already booked");
        }

        const booking = new Booking({
            user: req.session.user._id,
            salon: service.salon,
            service: serviceId,
            slot
        });

        await booking.save();

        res.send("Payment success & booking done");

    } catch (err) {
        console.log(err);
        res.send("Error booking");
    }
};

// ================= BOOKINGS =================

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

exports.bookSlot = async (req, res) => {
    const { serviceId, slot } = req.body;

    try {
        const service = await Service.findById(serviceId);

        const existingBooking = await Booking.findOne({
            service: serviceId,
            slot
        });

        if (existingBooking) {
            return res.send("Slot already booked");
        }

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