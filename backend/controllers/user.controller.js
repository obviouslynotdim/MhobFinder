import User from "../models/user.js";
import cloudinary from "../config/cloudinary.js";
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

// ---------------------------
// GET LOGGED-IN USER PROFILE
// ---------------------------
export const getMyProfile = async (req, res, next) => {
  try {
    return res.status(200).json({
      user: {
        user_id: req.user.user_id,
        name: req.user.name,
        email: req.user.email,
        image_url: req.user.image_url || null,
        isAdmin: Boolean(req.userIsAdmin),
      },
    });
  } catch (err) {
    return next(err);
  }
};

// ---------------------------
// UPDATE LOGGED-IN USER PROFILE
// ---------------------------
export const updateMyProfile = async (req, res, next) => {
  try {
    const incomingName = String(req.body?.name || "").trim();
    const hasNameUpdate = incomingName.length > 0;
    const hasImageUpdate = Boolean(req.file);

    if (!hasNameUpdate && !hasImageUpdate) {
      return res.status(400).json({
        error: "Please provide a name or an image file to update profile",
      });
    }

    if (hasNameUpdate) {
      if (incomingName.length > 100) {
        return res.status(400).json({ error: "name is too long" });
      }
      req.user.name = incomingName;
    }

    let image_url = null;
    if (req.file) {
      if (req.user.image_public_id) {
        await cloudinary.uploader.destroy(req.user.image_public_id);
      }

      const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const uploadResult = await cloudinary.uploader.upload(fileStr, {
        folder: "user_profiles",
      });
      image_url = uploadResult.secure_url;
      req.user.image_url = uploadResult.secure_url;
      req.user.image_public_id = uploadResult.public_id;
    }

    await req.user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        user_id: req.user.user_id,
        name: req.user.name,
        email: req.user.email,
        image_url: req.user.image_url || image_url,
      },
    });
  } catch (err) {
    return next(err);
  }
};
