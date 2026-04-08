const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Salon = require("../models/Salon");
const transporter = require("../config/mailer");

// Signup page
exports.getSignup = (req, res) => {
    res.render("signup");
};

// Signup logic
exports.postSignup = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = generateOTP();

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            otp,
            otpExpiry: Date.now() + 5 * 60 * 1000 // 5 min
        });

        await user.save();

        // 📧 send email
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Verify your account",
            text: `Your OTP is: ${otp}`
        });

        res.redirect(`/verify?email=${email}`);

    } catch (err) {
        console.log(err);
        res.send("Signup Error");
    }
};

// Login page
exports.getLogin = (req, res) => {
    res.render("login");
};

// Login logic
exports.postLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.send("User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.send("Wrong password");
        }

        if (!user.isVerified) {
            return res.send("Please verify your email first");
        }

        // session store
        req.session.user = user;

        // role based redirect
        if (user.role === "admin") {
            res.redirect("/admin/dashboard");
        } else if (user.role === "salon") {

            // 🔥 check if salon already exists
            const salon = await Salon.findOne({ owner: user._id });

            if (!salon) {
                return res.redirect("/salon/add");
            }else {
                return res.redirect("/salon/dashboard");
        }
} else {
            res.redirect("/user/search");
        }

    } catch (err) {
        console.log(err);
        res.send("Error in login");
    }
};

// Logout
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
};



function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}


exports.getVerifyPage = (req, res) => {
    res.render("verify", { email: req.query.email });
};

exports.postVerify = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) return res.send("User not found");

        if (user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.send("Invalid or expired OTP");
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;

        await user.save();

        res.redirect("/login");

    } catch (err) {
        console.log(err);
        res.send("Verification error");
    }
};