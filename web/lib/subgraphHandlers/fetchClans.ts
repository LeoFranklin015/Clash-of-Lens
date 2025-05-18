import { contractsConfig } from "../contractsConfig";

export const fetchClans = async (chainId: number) => {
  const subgraphUrl =
    contractsConfig[chainId as keyof typeof contractsConfig]?.subgraphUrl ||
    contractsConfig[37111].subgraphUrl;
  // 1. Fetch clans from subgraph
  const res = await fetch(subgraphUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `{
              clans {
                id
                balance
                owner
                status
              }
            }`,
    }),
  });
  const json = await res.json();
  return json.data.clans || [];
};
