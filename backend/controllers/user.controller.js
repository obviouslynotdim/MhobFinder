import User from "../models/user.js";
import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcryptjs"; // for hashing passwords
import {
  cleanText,
  normalizeEmail,
  parsePositiveInt,
} from "../utils/validation.js";
import { toSafeUser } from "../utils/serializers.js";

const canAccessUser = (req, targetUserId) => {
  if (!req.user) return false;
  return req.userIsAdmin || req.user.user_id === targetUserId;
};

// ---------------------------
// GET ALL USERS
// ---------------------------
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users.map(toSafeUser));
  } catch (err) {
    next(err);
  }
};

// ---------------------------
// REGISTER USER
// ---------------------------
export const register = async (req, res, next) => {
  try {
    const name = cleanText(req.body?.name, 100);
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");

    if (!name) {
      return res.status(400).json({ error: "Valid name is required" });
    }

    if (!email) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    if (password && password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    let hashedPassword = null;
    if (password.length > 0) {
      hashedPassword = await bcrypt.hash(password, 10);
    } else {
      hashedPassword = await bcrypt.hash("oauth_placeholder", 10);
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      is_oauth: password.length === 0,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: toSafeUser(user),
    });
  } catch (err) {
    next(err);
  }
};

// ---------------------------
// LOGIN USER
// ---------------------------
export const login = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

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

    res.status(200).json({ message: "Login successful", user: toSafeUser(user) });
  } catch (err) {
    next(err);
  }
};

// ---------------------------
// GET USER BY ID
// ---------------------------
export const getUserById = async (req, res, next) => {
  try {
    const userId = parsePositiveInt(req.params?.userId);
    if (!userId) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    if (!canAccessUser(req, userId)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(toSafeUser(user));
  } catch (err) {
    next(err);
  }
};

// ---------------------------
// DELETE USER
// ---------------------------
export const deleteUser = async (req, res, next) => {
  try {
    const userId = parsePositiveInt(req.params?.userId);
    if (!userId) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    if (!canAccessUser(req, userId)) {
      return res.status(403).json({ error: "Access denied" });
    }

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
    const hasNameField = Object.prototype.hasOwnProperty.call(req.body || {}, "name");
    const incomingName = cleanText(req.body?.name, 100);
    const hasNameUpdate = hasNameField && Boolean(incomingName);
    const hasImageUpdate = Boolean(req.file);

    if (hasNameField && !incomingName) {
      return res.status(400).json({
        error: "Name cannot be empty or longer than 100 characters",
      });
    }

    if (!hasNameUpdate && !hasImageUpdate) {
      return res.status(400).json({
        error: "Please provide a name or an image file to update profile",
      });
    }

    if (hasNameUpdate) {
      req.user.name = incomingName;
    }

    let image_url = null;
    const previousImagePublicId = req.user.image_public_id;
    let nextImagePublicId = null;
    if (req.file) {
      const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const uploadResult = await cloudinary.uploader.upload(fileStr, {
        folder: "user_profiles",
      });
      image_url = uploadResult.secure_url;
      nextImagePublicId = uploadResult.public_id;
      req.user.image_url = uploadResult.secure_url;
      req.user.image_public_id = uploadResult.public_id;
    }

    try {
      await req.user.save();
    } catch (saveError) {
      if (nextImagePublicId) {
        await cloudinary.uploader.destroy(nextImagePublicId).catch(() => null);
      }
      throw saveError;
    }

    if (nextImagePublicId && previousImagePublicId) {
      await cloudinary.uploader.destroy(previousImagePublicId).catch(() => null);
    }

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
