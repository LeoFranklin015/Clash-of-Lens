import { PublicClient, testnet } from "@lens-protocol/react";

export const client = PublicClient.create({
  environment: testnet,
  storage: typeof window !== "undefined" ? window.localStorage : undefined,
});
