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
    from: `"Salon Booking App" <${process.env.EMAIL}>`,
    to: email,
    subject: "Verify your account",
    html: `
    <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
        
        <div style="max-width:500px; margin:auto; background:#fff; padding:30px; border-radius:10px; text-align:center;">
            
            <h2 style="color:#333;">💈 Salon Booking App</h2>
            <p style="color:#555;">Verify your email to continue</p>

            <div style="margin:20px 0; padding:15px; background:#000; color:#fff; font-size:24px; letter-spacing:5px; border-radius:8px;">
                ${otp}
            </div>

            <p style="color:#777;">This OTP is valid for 5 minutes.</p>

            <hr style="margin:20px 0;">

            <p style="font-size:12px; color:#aaa;">
                If you didn’t request this, you can ignore this email.
            </p>

        </div>

    </div>
    `
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
        const cleanEmail = email.trim().toLowerCase();

        console.log("Entered Email:", cleanEmail);

        const user = await User.findOne({ email: cleanEmail });

        console.log("User:", user);

        if (!user) return res.send("User not found");

        const storedOTP = user.otp?.toString();
        const enteredOTP = otp.toString();

        if (storedOTP !== enteredOTP) {
            return res.send("Invalid OTP");
        }

        if (user.otpExpiry < Date.now()) {
            return res.send("OTP expired");
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