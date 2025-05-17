import { PublicClient, testnet } from "@lens-protocol/client";
import { createPublicClient, http } from "viem";
import { lensTestnet } from "viem/chains";
import dotenv from "dotenv";
dotenv.config();

export const client = PublicClient.create({
  environment: testnet,
  origin: "http://localhost:4000",
});

export const publicClient = createPublicClient({
  chain: lensTestnet,
  transport: http(
    `https://lens-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`
  ),
});
