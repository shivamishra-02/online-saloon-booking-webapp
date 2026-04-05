const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    salon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Salon"
    },
    name: String, // Haircut, Beard
    price: Number,
    slots: [String] // ["10:00 AM", "11:00 AM"]
});

module.exports = mongoose.model("Service", serviceSchema);