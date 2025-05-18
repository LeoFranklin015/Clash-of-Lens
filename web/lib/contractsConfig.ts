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
    contractAddress: "0xEA7B2f3E032Ea807082494200aCEE251058c1248",
    contractABI: ClashOfLensABI,
    subgraphUrl:
      "https://api.studio.thegraph.com/query/111645/clashoflens/version/latest",
  },
};
