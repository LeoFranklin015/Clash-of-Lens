import { PublicClient, mainnet } from "@lens-protocol/react";
import { custom, createWalletClient } from "viem";
import { http } from "viem";
import { createPublicClient } from "viem";
import { lens } from "viem/chains";

export const client = PublicClient.create({
  environment: mainnet,
  storage: typeof window !== "undefined" ? window.localStorage : undefined,
});

export const publicClient = createPublicClient({
  chain: lens,
  transport: http(),
});

// Safely create wallet client only in browser environment
export const walletClient =
  typeof window !== "undefined"
    ? createWalletClient({
        chain: lens,
        transport: custom(window.ethereum),
      })
    : null;
