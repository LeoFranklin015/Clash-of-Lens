import { PublicClient, mainnet } from "@lens-protocol/client";
import { createPublicClient, createWalletClient, http } from "viem";
import { lens } from "viem/chains";
import dotenv from "dotenv";
import { privateKeyToAccount } from "viem/accounts";
dotenv.config();

export const client = PublicClient.create({
  environment: mainnet,
  origin: "https://clash-of-lens.onrender.com",
});

export const publicClient = createPublicClient({
  chain: lens,
  transport: http(
    `https://lens-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`
  ),
});

const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

export const walletClient = createWalletClient({
  chain: lens,
  transport: http(
    `https://lens-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`
  ),
  account,
});
