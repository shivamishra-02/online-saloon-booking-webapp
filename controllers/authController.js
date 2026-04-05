const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Signup page
exports.getSignup = (req, res) => {
    res.render("signup");
};

// Signup logic
exports.postSignup = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await user.save();

        res.redirect("/login");
    } catch (err) {
        console.log(err);
        res.send("Error in signup");
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

        // session store
        req.session.user = user;

        // role based redirect
        if (user.role === "admin") {
            res.redirect("/admin/dashboard");
        } else if (user.role === "salon") {
            res.redirect("/salon/dashboard");
        } else {
            res.redirect("/user/dashboard");
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