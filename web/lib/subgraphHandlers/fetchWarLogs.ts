import { contractsConfig } from "../contractsConfig";

export const fetchWarLogs = async (
  chainId: number,
  clanAddress: `0x${string}`
) => {
  const subgraphUrl =
    contractsConfig[chainId as keyof typeof contractsConfig]?.subgraphUrl ||
    contractsConfig[37111].subgraphUrl;
  // 1. Fetch wars from subgraph
  const res = await fetch(subgraphUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: ` {
  wars(where: {or: {clan1: "${clanAddress}", clan2: "${clanAddress}"}}) {
    clan1 {
      id
    }
    result
    clan2 {
      id
    }
    timestamp
    id
  }
}`,
    }),
  });
  const json = await res.json();
  return json.data.wars || [];
};
