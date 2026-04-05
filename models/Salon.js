const mongoose = require("mongoose");

const salonSchema = new mongoose.Schema({
    name: String,
    location: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Salon", salonSchema);