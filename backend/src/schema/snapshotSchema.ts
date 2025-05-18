import mongoose from "mongoose";
// Define the snapshot schema
export const snapshotSchema = new mongoose.Schema({
  warId: String,
  clanAddress: String,
  address: String,
  snapshot: {
    bookmarks: Number,
    collects: Number,
    comments: Number,
    quotes: Number,
    upvotes: Number,
    downvotes: Number,
    reposts: Number,
    tips: Number,
  },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Create the model if it doesn't exist
export const Snapshots =
  mongoose.models.Snapshots || mongoose.model("Snapshots", snapshotSchema);
