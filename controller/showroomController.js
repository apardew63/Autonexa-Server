import Showroom from "../model/Showroom.js";
import User from "../model/User.js";
import multer from "multer";
import path from "path";

// Configure multer for logo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Create showroom
export const createShowroom = async (req, res) => {
  try {
    const { showroomName, ownerName, email, phone, address, city, description } = req.body;

    // Check if user is a dealer
    if (req.user.role !== 'dealer') {
      return res.status(403).json({ message: "Only dealers can create showrooms" });
    }

    // Check if dealer already has a showroom
    const existingShowroom = await Showroom.findOne({ dealerId: req.user._id });
    if (existingShowroom) {
      return res.status(400).json({ message: "Dealer already has a showroom" });
    }

    const logo = req.file ? `/uploads/${req.file.filename}` : null;

    const showroom = new Showroom({
      dealerId: req.user._id,
      showroomName,
      ownerName,
      email,
      phone,
      address,
      city,
      description,
      logo,
    });

    await showroom.save();
    res.status(201).json({ message: "Showroom created successfully", showroom });
  } catch (err) {
    console.error("Error creating showroom:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get dealer's showroom
export const getMyShowroom = async (req, res) => {
  try {
    if (req.user.role !== 'dealer') {
      return res.status(403).json({ message: "Only dealers can access showroom" });
    }

    const showroom = await Showroom.findOne({ dealerId: req.user._id });
    if (!showroom) {
      return res.status(404).json({ message: "Showroom not found" });
    }

    res.json(showroom);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update showroom
export const updateShowroom = async (req, res) => {
  try {
    if (req.user.role !== 'dealer') {
      return res.status(403).json({ message: "Only dealers can update showroom" });
    }

    const showroom = await Showroom.findOne({ dealerId: req.user._id });
    if (!showroom) {
      return res.status(404).json({ message: "Showroom not found" });
    }

    const { showroomName, ownerName, email, phone, address, city, description } = req.body;
    const logo = req.file ? `/uploads/${req.file.filename}` : showroom.logo;

    showroom.showroomName = showroomName || showroom.showroomName;
    showroom.ownerName = ownerName || showroom.ownerName;
    showroom.email = email || showroom.email;
    showroom.phone = phone || showroom.phone;
    showroom.address = address || showroom.address;
    showroom.city = city || showroom.city;
    showroom.description = description || showroom.description;
    showroom.logo = logo;

    await showroom.save();
    res.json({ message: "Showroom updated successfully", showroom });
  } catch (err) {
    console.error("Error updating showroom:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all showrooms (public)
export const getAllShowrooms = async (req, res) => {
  try {
    const showrooms = await Showroom.find().populate('dealerId', 'name email');
    res.json(showrooms);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get showroom by ID
export const getShowroomById = async (req, res) => {
  try {
    const showroom = await Showroom.findById(req.params.id).populate('dealerId', 'name email');
    if (!showroom) {
      return res.status(404).json({ message: "Showroom not found" });
    }
    res.json(showroom);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export { upload };