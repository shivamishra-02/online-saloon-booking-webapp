const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session
app.use(session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true
}));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// DB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Routes (abhi empty rahenge)
app.use("/", require("./routes/authRoutes"));

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

app.use("/", require("./routes/authRoutes"));
app.use("/user", require("./routes/userRoutes"));
app.use("/salon", require("./routes/salonRoutes"));
app.use("/admin", require("./routes/adminRoutes"));