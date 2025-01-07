import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Name is required" });
    }
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
        return res.json({ 
            error: true,
            message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();

    return res.json({
        error: false,
        user: newUser,
        message: "User created successfully",
    });
}

export const userLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const userInfo = await User.findOne({ email });
    if (!userInfo) {
        return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, userInfo.password);

    if (isMatch) {
        const access_token = jwt.sign(
            { _id: userInfo._id, email: userInfo.email },
            process.env.JWT_SECRET,
            { expiresIn: "36000m" }
        );
        return res.json({
            error: false,
            access_token,
            user: userInfo,
            message: "User logged in successfully",
        });
    } else {
        return res.status(400).json({ message: "Invalid credentials" });
    }
};


export const getUser = async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    try {
        const isUser = await User.findById(userId);
        if (!isUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({
            user: isUser,
            message: "User retrieved successfully",
        });
    } catch (err) {
        console.error("Error in getUser:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};








