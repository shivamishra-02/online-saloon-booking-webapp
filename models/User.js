const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ["user", "salon", "admin"],
        default: "user"
    },
    isVerified: {
    type: Boolean,
    default: false
    },
    otp: String,
    otpExpiry: Date,
});

module.exports = mongoose.model("User", userSchema);