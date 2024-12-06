const express = require("express");
const router = express.Router();
const User = require("../schemas/user.schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Sign Up
router.post("/signup", async (req, res) => {
    try {
        const { email, password, name, phone } = req.body;
        const isUserExist = await User.findOne({ email });
        if (isUserExist) return res.status(400).json({ message: "Email already taken" });

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await new User({ email, password: hashedPassword, name, phone }).save();
        const token = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JWT_SECRET);
        res.status(200).json({ message: "User created successfully", token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Sign In
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid email or password" });

        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET);
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
