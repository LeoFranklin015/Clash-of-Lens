import { contractsConfig } from "../contractsConfig";

export const fetchClans = async (
  chainId: number,
  clanAddress: `0x${string}`
) => {
  const subgraphUrl =
    contractsConfig[chainId as keyof typeof contractsConfig]?.subgraphUrl ||
    contractsConfig[37111].subgraphUrl;
  // 1. Fetch clans from subgraph
  const res = await fetch(subgraphUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: ` {
  clan(id: "${clanAddress}") {
    balance
  }
}`,
    }),
  });
  const json = await res.json();
  return json.data.clan.balance || 0;
};
