import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { getPostDetails } from "./handlers/getPostDetails";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/clashoflens";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error: Error) => {
    console.error("MongoDB connection error:", error);
  });

// Basic route
app.get("/", async (req: Request, res: Response) => {
  const details = await getPostDetails(
    "0x446e9e88Dc725f236527535a44Ae1fdEfbC47B55"
  );
  res.json({
    message: "Welcome to Clash of Lens API",
    details,
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
