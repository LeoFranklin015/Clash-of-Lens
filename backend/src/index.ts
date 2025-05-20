import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { getPostDetails } from "./handlers/getPostDetails";
import { getGroupMembers } from "./handlers/getGroupMembers";
import { ContractListener } from "./utils/ContractListner";
import { authenticate } from "./utils/authentication";
import { ClashOfLensAddress } from "./utils/abi";
import { postWarDetails } from "./handlers/postWarDetails";
import { storeSnapShot } from "./handlers/storeSnapShot";
import { processSnapShot } from "./handlers/processSnapShot";
import { getWarStats } from "./handlers/getWarStats";

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
  // const details = await getPostDetails(
  //   "0x446e9e88Dc725f236527535a44Ae1fdEfbC47B55"
  // );
  // const sessionClient = await authenticate();
  // console.log(sessionClient);
  // const members = await getGroupMembers(
  //   "0x00F5b8244C1aDE1E11ec7a214773c3a41125516d"
  // );
  await postWarDetails(
    "1",
    "0x92a23d5600E1aB4489b16De50a30047EA9b6249B",
    "0x22eF1cA9eA0f5c49c2eD41c95169181a3d91309A"
  );

  // await storeSnapShot(
  //   "2",
  //   "0x5ce25d46036029879581bab2f09b70d713211089",
  //   "0x587bdcdb5ccf375b04c077a1af1d523122913b9d"
  // );

  // await processSnapShot();
  res.json({
    message: "Welcome to Clash of Lens API",
  });
});

app.get("/warstats", async (req: Request, res: Response) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "War ID is required" });
  }
  const warStats = await getWarStats(id as string);
  res.status(200).json(warStats);
});

app.get("/check-wars", async (req: Request, res: Response) => {
  console.log("Processing wars");
  await processSnapShot();
  res.status(200).json({ message: "Wars processed" });
});

const contractListener = new ContractListener(
  ClashOfLensAddress,
  "WarDeclared"
);
contractListener.startListening((logs) => {
  console.log(logs);
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
