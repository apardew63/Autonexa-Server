import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../model/User.js";

const router = express.Router();

export const register = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password, role, phone, address, city } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      phone,
      address,
      city,
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        city: user.city,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Email/Password Login
export const login = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        city: user.city,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateProfile = async (req, res) => {
  try {
    console.log('=== PROFILE UPDATE REQUEST ===');
    console.log('Request body:', req.body);
    console.log('Request user:', req.user);

    const { name, phone, address, city } = req.body;
    const userId = req.user._id;

    console.log('Updating profile for user:', userId);
    console.log('Update data:', { name, phone, address, city });

    // Validate that we have a user ID
    if (!userId) {
      console.log('No user ID found in request');
      return res.status(400).json({ message: "User ID not found" });
    }

    // Build update object with only provided fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;

    console.log('Final update data:', updateData);

    // Check if updateData is empty
    if (Object.keys(updateData).length === 0) {
      console.log('No valid fields to update');
      return res.status(400).json({ message: "No valid fields to update" });
    }

    console.log('Executing database update...');
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      console.log('User not found for update');
      return res.status(404).json({ message: "User not found" });
    }

    console.log('Profile updated successfully:', updatedUser);
    console.log('=== PROFILE UPDATE SUCCESS ===');

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("=== PROFILE UPDATE ERROR ===");
    console.error("Error:", err);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    console.error("Request body:", req.body);
    console.error("Request user:", req.user);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export default router;
