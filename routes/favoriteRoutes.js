import express from "express";
const router = express.Router();
import verifyToken from "../middleware/authMiddleware.js";
import {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  checkFavoriteStatus,
} from "../controller/favoriteController.js";

// Add listing to favorites
router.post("/:listingId", verifyToken, addToFavorites);

// Remove listing from favorites
router.delete("/:listingId", verifyToken, removeFromFavorites);

// Get user's favorite listings
router.get("/", verifyToken, getUserFavorites);

// Check if listing is favorited by user
router.get("/check/:listingId", verifyToken, checkFavoriteStatus);

export default router;