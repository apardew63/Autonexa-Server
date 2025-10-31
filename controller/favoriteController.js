import Favorite from "../model/Favorite.js";
import Listing from "../model/Listing.js";

// Add listing to favorites
export const addToFavorites = async (req, res) => {
  try {
    const { listingId } = req.params;

    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      userId: req.user._id,
      listingId: listingId
    });

    if (existingFavorite) {
      return res.status(400).json({ message: "Listing already in favorites" });
    }

    const favorite = new Favorite({
      userId: req.user._id,
      listingId: listingId
    });

    await favorite.save();
    res.status(201).json({ message: "Added to favorites successfully" });
  } catch (err) {
    console.error("Error adding to favorites:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove listing from favorites
export const removeFromFavorites = async (req, res) => {
  try {
    const { listingId } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      userId: req.user._id,
      listingId: listingId
    });

    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.json({ message: "Removed from favorites successfully" });
  } catch (err) {
    console.error("Error removing from favorites:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's favorite listings
export const getUserFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id })
      .populate({
        path: 'listingId',
        populate: [
          { path: 'userId', select: 'name email profileImage role' },
          { path: 'showroomId', select: 'showroomName city' }
        ]
      })
      .sort({ createdAt: -1 });

    const favoriteListings = favorites.map(fav => fav.listingId).filter(listing => listing !== null);

    res.json(favoriteListings);
  } catch (err) {
    console.error("Error fetching favorites:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Check if listing is favorited by user
export const checkFavoriteStatus = async (req, res) => {
  try {
    const { listingId } = req.params;

    const favorite = await Favorite.findOne({
      userId: req.user._id,
      listingId: listingId
    });

    res.json({ isFavorited: !!favorite });
  } catch (err) {
    console.error("Error checking favorite status:", err);
    res.status(500).json({ message: "Server error" });
  }
};