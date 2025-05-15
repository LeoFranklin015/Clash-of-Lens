import { ClashOfLensABI } from "@/lib/abis/ClashOfLens";

export const contractsConfig = {
  lensMainnet: {
    contractAddress: "0x0000000000000000000000000000000000000000",
    contractABI: ClashOfLensABI,
  },
  lensTestnet: {
    contractAddress: "0xb9fC506955C7b55c40Bed8554a6def33C305078E",
    contractABI: ClashOfLensABI,
  },
};
