import { fetchGroups } from "@lens-protocol/client/actions";
import { evmAddress } from "@lens-protocol/client";
import { client } from "@/lib/client";
import { contractsConfig } from "@/lib/contractsConfig";

interface ClanSubgraph {
  id: string;
  balance: string;
  owner: string;
  status: number;
}

export const checkMemberIsAlreadyInClan = async (
  member: `0x${string}`,
  chainId: number
) => {
  const subgraphUrl =
    contractsConfig[chainId as keyof typeof contractsConfig]?.subgraphUrl ||
    contractsConfig[232].subgraphUrl;
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
  const clansFromSubgraph: ClanSubgraph[] = json.data?.clans || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const memberGroups: any = await fetchGroups(client, {
    filter: {
      member: evmAddress(member),
    },
  });

  const isMember = memberGroups.value.items.some(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (memberGroup: any) => {
      return clansFromSubgraph.some(
        (clan: ClanSubgraph) =>
          clan.id.toLowerCase() === memberGroup.address.toLowerCase()
      );
    }
  );

  console.log(isMember);
  return isMember;
};
