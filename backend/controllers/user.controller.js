import User from "../models/User.js";
import bcrypt from "bcryptjs"; // for hashing passwords

// ---------------------------
// REGISTER USER
// ---------------------------
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      is_oauth: false,
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    next(err);
  }
};

// ---------------------------
// LOGIN USER
// ---------------------------
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    // If OAuth user
    if (user.is_oauth) {
      return res.status(400).json({ error: "Use Google login for this account" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    next(err);
  }
};
