import {
  BrowserProvider,
  getDefaultProvider,
  Network,
} from "@lens-chain/sdk/ethers";
import { Eip1193Provider } from "ethers";

// Lens Chain (L2)
export const lensProvider = getDefaultProvider(Network.Mainnet);

// User's network
export const browserProvider =
  typeof window !== "undefined"
    ? new BrowserProvider(window.ethereum as Eip1193Provider)
    : null;
