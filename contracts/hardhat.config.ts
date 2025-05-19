import { HardhatUserConfig } from "hardhat/config";
import "@matterlabs/hardhat-zksync";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  zksolc: {
    version: "latest",
    settings: {},
  },
  networks: {
    lensMainnet: {
      url: "https://rpc.lens.xyz",
      ethNetwork: "mainnet",
      chainId: 232,
      accounts: [PRIVATE_KEY],
      verifyURL:
        "https://block-explorer-verify.testnet.lens.dev/contract_verification",
      zksync: true,
      // currencySymbol: "GHO", // Not a standard Hardhat field, but left as a comment for reference
      // blockExplorerUrl: "https://explorer.lens.xyz", // Not a standard Hardhat field, but left as a comment for reference
    },
    lensTestnet: {
      url: "https://rpc.testnet.lens.xyz",
      chainId: 37111,
      ethNetwork: "sepolia",
      accounts: [PRIVATE_KEY],
      verifyURL:
        "https://block-explorer-verify.testnet.lens.dev/contract_verification",
      zksync: true,
      // currencySymbol: "GRASS", // Not a standard Hardhat field, but left as a comment for reference
      // blockExplorerUrl: "https://explorer.testnet.lens.xyz", // Not a standard Hardhat field, but left as a comment for reference
    },
    hardhat: {
      zksync: true,
    },
  },
};

export default config;
