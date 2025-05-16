import { PublicClient, testnet } from "@lens-protocol/react";
import { custom, createWalletClient } from "viem";
import { http } from "viem";
import { createPublicClient } from "viem";
import { lensTestnet } from "viem/chains";

export const client = PublicClient.create({
  environment: testnet,
  storage: typeof window !== "undefined" ? window.localStorage : undefined,
});

export const publicClient = createPublicClient({
  chain: lensTestnet,
  transport: http(),
});

// Safely create wallet client only in browser environment
export const walletClient =
  typeof window !== "undefined"
    ? createWalletClient({
        chain: lensTestnet,
        transport: custom(window.ethereum),
      })
    : null;
