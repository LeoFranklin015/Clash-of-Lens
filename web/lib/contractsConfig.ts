import { ClashOfLensABI } from "@/lib/abis/ClashOfLens";
import { lensTestnet, lens } from "wagmi/chains";

export const contractsConfig = {
  [lens.id]: {
    contractAddress: "0x57223AABb448F552Bd69cd48e4bCA980aDa9EAaB",
    contractABI: ClashOfLensABI,
    subgraphUrl:
      "https://api.studio.thegraph.com/query/111645/clashoflens-mainnet/version/latest",
  },
  [lensTestnet.id]: {
    contractAddress: "0xCfB71095c4D727cDE4c7BC8D208B3F6CccB2f169",
    contractABI: ClashOfLensABI,
    subgraphUrl:
      "https://api.studio.thegraph.com/query/111645/clashoflens/version/latest",
  },
};
