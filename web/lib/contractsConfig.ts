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
    contractAddress: "0xAE034B38BA70a3293C1368E08530EeDEb522474F",
    contractABI: ClashOfLensABI,
    subgraphUrl:
      "https://api.studio.thegraph.com/query/111645/clashoflens/version/latest",
  },
};
