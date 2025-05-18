import { contractsConfig } from "../contractsConfig";

export const fetchWarClans = async (chainId: number, warId: string) => {
  const subgraphUrl =
    contractsConfig[chainId as keyof typeof contractsConfig]?.subgraphUrl ||
    contractsConfig[37111].subgraphUrl;
  // 1. Fetch wars from subgraph
  const res = await fetch(subgraphUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: ` query MyQuery {
  war(id: "${warId}") {
    clan1 {
      id
    }
    clan2 {
      id
    }
    result
    timestamp
    id
  }
}`,
    }),
  });
  const json = await res.json();
  return json.data.war || {};
};
