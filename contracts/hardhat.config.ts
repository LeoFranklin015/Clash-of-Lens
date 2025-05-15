import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    lensMainnet: {
      url: "https://rpc.lens.xyz",
      chainId: 232,
      accounts: [PRIVATE_KEY],
      // currencySymbol: "GHO", // Not a standard Hardhat field, but left as a comment for reference
      // blockExplorerUrl: "https://explorer.lens.xyz", // Not a standard Hardhat field, but left as a comment for reference
    },
    lensTestnet: {
      url: "https://rpc.testnet.lens.xyz",
      chainId: 37111,
      accounts: [PRIVATE_KEY],
      // currencySymbol: "GRASS", // Not a standard Hardhat field, but left as a comment for reference
      // blockExplorerUrl: "https://explorer.testnet.lens.xyz", // Not a standard Hardhat field, but left as a comment for reference
    },
  },
};

export default config;
