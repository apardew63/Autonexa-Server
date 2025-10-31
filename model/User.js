import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['user', 'dealer'], default: 'user' },
  profileImage: String,
  phone: String,
  address: String,
  city: String,
}, { timestamps: true });

export default mongoose.model("User", userSchema);
