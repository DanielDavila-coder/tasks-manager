import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import {
  COOKIE_OPTIONS,
  HAS_CLOUDINARY_CONFIG,
  TOKEN_SECRET,
} from "../config.js";
import Task from "../models/task.model.js";
import cloudinary from "../libs/cloudinary.js";

const formatUserResponse = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  avatar: user.avatar,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const register = async (req, res) => {
  const { email, password, username } = req.body;
  const cleanEmail = email.trim().toLowerCase();

  try {
    const userFound = await User.findOne({ email: cleanEmail });
    if (userFound) return res.status(400).json(["The email is already in use"]);

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email: cleanEmail,
      password: passwordHash,
    });

    const useSaved = await newUser.save();
    const token = await createAccessToken({ id: useSaved._id });

    res.cookie("token", token, COOKIE_OPTIONS);
    res.json(formatUserResponse(useSaved));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const cleanEmail = email.trim().toLowerCase();

  try {
    const userFound = await User.findOne({ email: cleanEmail });
    if (!userFound) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    const token = await createAccessToken({ id: userFound._id });

    res.cookie("token", token, COOKIE_OPTIONS);
    res.json(formatUserResponse(userFound));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    ...COOKIE_OPTIONS,
    maxAge: 0,
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);

  if (!userFound) return res.status(400).json({ message: "User not found" });

  return res.json(formatUserResponse(userFound));
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });

    try {
      const userFound = await User.findById(user.id);
      if (!userFound) return res.status(401).json({ message: "Unauthorized" });

      return res.json(formatUserResponse(userFound));
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
};

export const updateUsername = async (req, res) => {
  const { username } = req.body;

  if (!username || !username.trim()) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const userUpdated = await User.findByIdAndUpdate(
      req.user.id,
      { username: username.trim() },
      { new: true },
    );

    if (!userUpdated) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(formatUserResponse(userUpdated));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateEmail = async (req, res) => {
  const { email } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ message: "Email is required" });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const emailFound = await User.findOne({ email: cleanEmail });

    if (emailFound && emailFound._id.toString() !== req.user.id) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const userUpdated = await User.findByIdAndUpdate(
      req.user.id,
      { email: cleanEmail },
      { new: true },
    );

    if (!userUpdated) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(formatUserResponse(userUpdated));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Current password and new password are required" });
  }

  if (newPassword.length < 8) {
    return res
      .status(400)
      .json({ message: "New password must be at least 8 characters" });
  }

  try {
    const userFound = await User.findById(req.user.id);

    if (!userFound) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, userFound.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    userFound.password = passwordHash;
    await userFound.save();

    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userFound = await User.findById(req.user.id);

    if (!userFound) {
      return res.status(404).json({ message: "User not found" });
    }

    if (HAS_CLOUDINARY_CONFIG && userFound.avatarPublicId) {
      await cloudinary.uploader.destroy(userFound.avatarPublicId);
    }

    await Task.deleteMany({ usuario: req.user.id });

    await User.findByIdAndDelete(req.user.id);

    res.cookie("token", "", {
      ...COOKIE_OPTIONS,
      maxAge: 0,
      expires: new Date(0),
    });

    return res.json({ message: "Account deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const uploadImageToCloudinary = (buffer) => {
  if (!HAS_CLOUDINARY_CONFIG) {
    throw new Error("Cloudinary is not configured");
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "tasks-manager/avatars",
        transformation: [{ width: 400, height: 400, crop: "fill" }],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    stream.end(buffer);
  });
};

export const updateAvatar = async (req, res) => {
  if (!HAS_CLOUDINARY_CONFIG) {
    return res.status(503).json({
      message: "Profile image uploads are not available right now",
    });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Profile image is required" });
  }

  try {
    const userFound = await User.findById(req.user.id);

    if (!userFound) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userFound.avatarPublicId) {
      await cloudinary.uploader.destroy(userFound.avatarPublicId);
    }

    const result = await uploadImageToCloudinary(req.file.buffer);

    userFound.avatar = result.secure_url;
    userFound.avatarPublicId = result.public_id;

    await userFound.save();

    return res.json(formatUserResponse(userFound));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
