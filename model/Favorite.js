import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Listing",
  },
}, { timestamps: true });

// Ensure a user can't favorite the same listing twice
favoriteSchema.index({ userId: 1, listingId: 1 }, { unique: true });

export default mongoose.model("Favorite", favoriteSchema);