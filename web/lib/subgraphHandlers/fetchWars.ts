import { contractsConfig } from "../contractsConfig";

export const fetchWars = async (chainId: number) => {
  const subgraphUrl =
    contractsConfig[chainId as keyof typeof contractsConfig]?.subgraphUrl ||
    contractsConfig[37111].subgraphUrl;
  // 1. Fetch wars from subgraph
  const res = await fetch(subgraphUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: ` 
query MyQuery {
  wars {
    id
    result
    timestamp
    clan1 {
      id
      owner
    }
    clan2 {
      id
      owner
    }
  }
}
`,
    }),
  });
  const json = await res.json();
  return json.data.wars || [];
};
