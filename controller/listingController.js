import Listing from "../model/Listing.js";

export const createListing = async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("Files:", req.files);
    const images = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];

    let showroomId = null;
    if (req.user.role === 'dealer') {
      const Showroom = (await import("../model/Showroom.js")).default;
      const showroom = await Showroom.findOne({ dealerId: req.user._id });
      showroomId = showroom ? showroom._id : null;
    }

    // Prepare listing data, excluding empty showroomId for non-dealers
    const listingData = {
      userId: req.user._id,
      title: req.body.title,
      make: req.body.make,
      model: req.body.model,
      year: req.body.year,
      mileage: req.body.mileage,
      engine: req.body.engine,
      transmission: req.body.transmission,
      color: req.body.color,
      condition: req.body.condition,
      price: req.body.price,
      description: req.body.description,
      images,
      location: req.body.location,
    };

    // Only add showroomId if it's not empty and user is a dealer
    if (showroomId) {
      listingData.showroomId = showroomId;
    }

    const listing = new Listing(listingData);
    await listing.save();
    res.status(201).json({ message: "Listing created successfully", listing });
  } catch (err) {
    console.error("Error creating listing:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserListings = async (req, res) => {
  try {
    const listings = await Listing.find({ userId: req.user._id })
      .populate('showroomId', 'showroomName city')
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get showroom listings (for dealers)
export const getShowroomListings = async (req, res) => {
  try {
    if (req.user.role !== 'dealer') {
      return res.status(403).json({ message: "Only dealers can access showroom listings" });
    }

    const Showroom = (await import("../model/Showroom.js")).default;
    const showroom = await Showroom.findOne({ dealerId: req.user._id });
    if (!showroom) {
      return res.status(404).json({ message: "Showroom not found" });
    }

    const listings = await Listing.find({ showroomId: showroom._id })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update listing
export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findOne({ _id: req.params.id, userId: req.user._id });
    if (!listing) {
      return res.status(404).json({ message: "Listing not found or unauthorized" });
    }

    const images = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : listing.images;

    Object.assign(listing, req.body, { images });
    await listing.save();
    res.json({ message: "Listing updated successfully", listing });
  } catch (err) {
    console.error("Error updating listing:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete listing
export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!listing) {
      return res.status(404).json({ message: "Listing not found or unauthorized" });
    }
    res.json({ message: "Listing deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate('userId', 'name email profileImage role')
      .populate('showroomId', 'showroomName city')
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('userId', 'name email profileImage role')
      .populate('showroomId', 'showroomName city address');
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
