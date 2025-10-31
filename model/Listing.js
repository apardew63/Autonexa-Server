import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  showroomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Showroom",
  },
  title: {
    type: String,
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  mileage: {
    type: Number,
    required: true,
  },
  engine: {
    type: String,
    required: true,
  },
  transmission: {
    type: String,
    required: true,
    enum: ['Manual', 'Automatic', 'CVT', 'Semi-Automatic'],
  },
  color: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    required: true,
    enum: ['New', 'Used'],
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [String],
  location: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Listing", listingSchema);
