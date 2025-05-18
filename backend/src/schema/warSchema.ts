import mongoose from "mongoose";
// Define the snapshot schema
export const warSchema = new mongoose.Schema({
  warId: String,
  clan1: String,
  clan2: String,
  completed: { type: Boolean, default: false },
  result: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Create the model if it doesn't exist
export const War = mongoose.models.War || mongoose.model("War", warSchema);
