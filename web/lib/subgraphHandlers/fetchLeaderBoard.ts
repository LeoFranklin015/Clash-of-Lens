import { contractsConfig } from "../contractsConfig";
import { fetchGroup, fetchGroupMembers } from "@lens-protocol/client/actions";
import { client } from "@/lib/client";
import { evmAddress } from "@lens-protocol/client";

export const fetchLeaderBoard = async (chainId: number) => {
  const subgraphUrl =
    contractsConfig[chainId as keyof typeof contractsConfig]?.subgraphUrl ||
    contractsConfig[232].subgraphUrl;
  // 1. Fetch clans from subgraph
  const res = await fetch(subgraphUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `query MyQuery {
  clans(orderBy: wins, orderDirection: desc, first: 10) {
    id
    owner
    status
    wins
  }
}`,
    }),
  });
  const json = await res.json();
  const clans = json.data.clans || [];

  const clansWithDetails = await Promise.all(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clans.map(async (clan: any) => {
      const clanDetails = await fetchGroup(client, {
        group: evmAddress(clan.id),
      });
      if (clanDetails.isOk()) {
        const clanMembers = await fetchGroupMembers(client, {
          group: evmAddress(clan.id),
        });
        console.log(clanMembers);
        if (clanMembers.isOk()) {
          return {
            ...clan,
            ...clanDetails.value,
            members: clanMembers.value.items.length,
          };
        }
      }
    })
  );

  const clansWithDetailsSorted = clansWithDetails.sort(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (a: any, b: any) => b.wins - a.wins
  );

  console.log(clansWithDetailsSorted);
  return clansWithDetailsSorted;
};
