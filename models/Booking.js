const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    salon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Salon"
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service"
    },
    slot: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Booking", bookingSchema);