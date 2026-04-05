const Salon = require("../models/Salon");
const Service = require("../models/Service");

// form show karne ke liye
exports.getAddSalon = (req, res) => {
    res.render("salon/addSalon");
};

// salon save karne ke liye
exports.postAddSalon = async (req, res) => {
    const { name, location } = req.body;

    try {
        const salon = new Salon({
            name,
            location,
            owner: req.session.user._id
        });

        await salon.save();

        res.redirect("/salon/dashboard");
    } catch (err) {
        console.log(err);
        res.send("Error adding salon");
    }
};



// service add form
exports.getAddService = (req, res) => {
    const salonId = req.params.id;
    res.render("salon/addService", { salonId });
};

// save service
exports.postAddService = async (req, res) => {
    const { name, price, slots } = req.body;
    const salonId = req.params.id;

    try {
        const service = new Service({
            salon: salonId,
            name,
            price,
            slots: slots.split(",") // comma separated input
        });

        await service.save();

        res.redirect("/salon/dashboard");
    } catch (err) {
        console.log(err);
        res.send("Error adding service");
    }
};