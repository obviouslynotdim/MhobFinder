import User from "../models/User.js";
// ---------------------------
// GET ALL USERS
// ---------------------------
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
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
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    } else {
      hashedPassword = await bcrypt.hash("oauth_placeholder", 10);
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      is_oauth: password ? false : true,
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
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    // If OAuth user
    if (user.is_oauth) {
      return res
        .status(400)
        .json({ error: "Use Google login for this account" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password" });

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    next(err);
  }
};

// ---------------------------
// GET USER BY ID
// ---------------------------
export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// ---------------------------
// DELETE USER
// ---------------------------
export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    await user.destroy(); // Cascade deletes if associations are set in Sequelize
    res.status(200).json({ message: "User and related data deleted" });
  } catch (err) {
    next(err);
  }
};
