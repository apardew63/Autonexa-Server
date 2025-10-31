import Listing from "../model/Listing.js";
import Showroom from "../model/Showroom.js";
import User from "../model/User.js";
import Favorite from "../model/Favorite.js";

// Get user dashboard data
export const getUserDashboard = async (req, res) => {
  try {
    if (req.user.role === 'dealer') {
      return res.status(403).json({ message: "Access denied: Dealers should use dealer dashboard" });
    }
    const userListings = await Listing.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    const totalListings = await Listing.countDocuments({ userId: req.user._id });

    // Get user's favorite listings
    const favoriteListings = await Favorite.find({ userId: req.user._id })
      .populate({
        path: 'listingId',
        populate: [
          { path: 'userId', select: 'name email profileImage role' },
          { path: 'showroomId', select: 'showroomName city' }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(10);

    const favoriteListingsData = favoriteListings
      .map(fav => fav.listingId)
      .filter(listing => listing !== null);

    res.json({
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        phone: req.user.phone,
        address: req.user.address,
        city: req.user.city,
      },
      stats: {
        totalListings,
        totalFavorites: favoriteListings.length,
      },
      recentListings: userListings,
      favoriteListings: favoriteListingsData,
    });
  } catch (err) {
    console.error("Error fetching user dashboard:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get dealer dashboard data
export const getDealerDashboard = async (req, res) => {
  try {
    if (req.user.role !== 'dealer') {
      return res.status(403).json({ message: "Access denied" });
    }

    const showroom = await Showroom.findOne({ dealerId: req.user._id });

    let showroomListings = [];
    let totalListings = 0;

    if (showroom) {
      showroomListings = await Listing.find({ showroomId: showroom._id })
        .sort({ createdAt: -1 })
        .limit(10);
      totalListings = await Listing.countDocuments({ showroomId: showroom._id });
    }

    res.json({
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        phone: req.user.phone,
        address: req.user.address,
        city: req.user.city,
      },
      showroom: showroom ? {
        _id: showroom._id,
        showroomName: showroom.showroomName,
        ownerName: showroom.ownerName,
        email: showroom.email,
        phone: showroom.phone,
        address: showroom.address,
        city: showroom.city,
        description: showroom.description,
        logo: showroom.logo,
      } : null,
      stats: {
        totalListings,
        hasShowroom: !!showroom,
      },
      recentListings: showroomListings,
      favoriteListings: [], // Dealers can also have favorites, but we'll keep it empty for now
    });
  } catch (err) {
    console.error("Error fetching dealer dashboard:", err);
    res.status(500).json({ message: "Server error" });
  }
};