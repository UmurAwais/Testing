import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * @desc    Admin login
 * @route   POST /api/admin/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || "secret123",
            { expiresIn: "7d" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * @desc    Admin signup
 * @route   POST /api/admin/signup
 * @access  Public
 */
export const signupUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await User.create({
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
