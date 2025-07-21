import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  image: String,
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
