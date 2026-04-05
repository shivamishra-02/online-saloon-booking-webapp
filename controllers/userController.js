const Salon = require("../models/Salon");

const Service = require("../models/Service");

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