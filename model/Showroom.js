import mongoose from "mongoose";

const showroomSchema = new mongoose.Schema({
  dealerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  showroomName: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  description: String,
  logo: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Showroom", showroomSchema);