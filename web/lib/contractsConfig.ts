import { ClashOfLensABI } from "@/lib/abis/ClashOfLens";
import { lensTestnet, lens } from "wagmi/chains";

export const contractsConfig = {
  [lens.id]: {
    contractAddress: "0x0000000000000000000000000000000000000000",
    contractABI: ClashOfLensABI,
    subgraphUrl:
      "https://api.studio.thegraph.com/query/111645/clashoflens/version/latest",
  },
  [lensTestnet.id]: {
    contractAddress: "0xe2d065594ed1941f84560EB485C7578aD224DDCF",
    contractABI: ClashOfLensABI,
    subgraphUrl:
      "https://api.studio.thegraph.com/query/111645/clashoflens/version/latest",
  },
};
