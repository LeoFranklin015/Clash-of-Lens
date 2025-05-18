"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Trophy, Search, Filter } from "lucide-react";
import { useAccount, useChainId } from "wagmi";
import {
  fetchAccounts,
  fetchAccountsBulk,
  fetchGroup,
  fetchGroupMembers,
  fetchGroups,
} from "@lens-protocol/client/actions";
import { storageClient } from "@/lib/storage-client";
import { client } from "@/lib/client";
import { evmAddress, Group } from "@lens-protocol/client";
import { checkMemberIsAlreadyInClan } from "@/lib/checkAvailablility";

interface ClanSubgraph {
  id: string;
  balance: string;
  owner: string;
  status: number;
}

interface ClanCardData {
  id: string;
  balance: string;
  owner: string;
  status: number;
  name: string;
  description: string;
  logo: string;
  banner: string;
  leader: string;
  founded: string;
  members: number;
  wins: number;
}

export const SUBGRAPH_CONFIG: Record<number, { subgraphUrl: string }> = {
  232: {
    subgraphUrl:
      "https://api.studio.thegraph.com/query/111645/clashoflens/version/latest",
  },
  37111: {
    subgraphUrl:
      "https://api.studio.thegraph.com/query/111645/clashoflens/version/latest",
  },
};

export default function ClanDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clans, setClans] = useState<ClanCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMemberInClan, setIsMemberInClan] = useState(false);
  const chainId = useChainId();
  const { address } = useAccount();

  useEffect(() => {
    async function fetchClans() {
      setLoading(true);
      setError(null);
      try {
        const subgraphUrl =
          SUBGRAPH_CONFIG[chainId]?.subgraphUrl ||
          SUBGRAPH_CONFIG[37111].subgraphUrl;
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
        // 2. For each clan, fetch metadata from Lens
        const enrichedClans: ClanCardData[] = await Promise.all(
          clansFromSubgraph.map(async (clan) => {
            try {
              const groupResult = await fetchGroup(client, {
                group: evmAddress(clan.id),
              });

              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const membersResult: any = await fetchGroupMembers(client, {
                group: evmAddress(clan.id),
              });
              if (groupResult.isOk() && groupResult.value) {
                const group = groupResult.value as Group;
                // Use inline type casts for metadata and group fields
                const metadata =
                  (group.metadata as {
                    name?: string;
                    description?: string;
                    icon?: string;
                    coverPicture?: string;
                  }) || {};
                const name =
                  typeof metadata.name === "string" ? metadata.name : undefined;
                const description =
                  typeof metadata.description === "string"
                    ? metadata.description
                    : undefined;
                const icon =
                  typeof metadata.icon === "string" ? metadata.icon : undefined;
                const coverPicture =
                  typeof metadata.coverPicture === "string"
                    ? metadata.coverPicture
                    : undefined;
                // Some fields like membersCount and wins may not be typed on Group, so use 'as { membersCount?: number; wins?: number }'
                const membersCount = membersResult.value.items.length || 0;
                const wins = (group as { wins?: number }).wins ?? 0;
                return {
                  id: clan.id,
                  balance: clan.balance,
                  owner: clan.owner,
                  status: clan.status,
                  name: name || "Unknown Clan",
                  description: description || "No description available.",
                  logo: icon ? storageClient.resolve(icon) : "/placeholder.svg",
                  banner: coverPicture
                    ? storageClient.resolve(coverPicture)
                    : "/placeholder.svg",
                  leader: group.owner || "Unknown",
                  founded: group.timestamp
                    ? new Date(group.timestamp).toLocaleDateString()
                    : "Unknown",
                  members: membersCount,
                  wins: wins,
                };
              } else {
                return {
                  id: clan.id,
                  balance: clan.balance,
                  owner: clan.owner,
                  status: clan.status,
                  name: "Unknown Clan",
                  description: "No description available.",
                  logo: "/placeholder.svg",
                  banner: "/placeholder.svg",
                  leader: clan.owner || "Unknown",
                  founded: "Unknown",
                  members: 0,
                  wins: 0,
                };
              }
            } catch {
              return {
                id: clan.id,
                balance: clan.balance,
                owner: clan.owner,
                status: clan.status,
                name: "Unknown Clan",
                description: "No description available.",
                logo: "/placeholder.svg",
                banner: "/placeholder.svg",
                leader: clan.owner || "Unknown",
                founded: "Unknown",
                members: 0,
                wins: 0,
              };
            }
          })
        );
        setClans(enrichedClans);
      } catch (err: unknown) {
        setError((err as Error).message || "Failed to fetch clans.");
      } finally {
        setLoading(false);
      }
    }
    fetchClans();
  }, [chainId, address]);

  useEffect(() => {
    const fetchProfile = async (address: `0x${string}`) => {
      const result = await fetchAccountsBulk(client, {
        ownedBy: [evmAddress(address!)],
      });

      if (result.isErr()) {
        return console.error(result.error);
      }

      const profile = result.value[0];

      if (profile) {
        const res: boolean = await checkMemberIsAlreadyInClan(
          profile.address,
          chainId
        );
        setIsMemberInClan(res);
      }
    };

    if (address && chainId) {
      fetchProfile(address);
    }
  }, [address, chainId]);

  const filteredClans = clans.filter((clan) =>
    clan.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const readyClans = filteredClans.filter((clan) => clan.status === 0);

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page header */}
      <div className="mt-12 mb-8">
        <h1 className="text-[#a3ff12] font-extrabold text-4xl md:text-5xl tracking-tighter">
          CLAN DIRECTORY
        </h1>
        <p className="text-gray-400 mt-2">
          Join an existing clan or create your own to start battling for
          supremacy
        </p>
      </div>
      {/* Search and filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="relative w-full md:w-auto flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search clans..."
            className="pl-10 bg-black border-[#a3ff12] focus:ring-[#a3ff12] text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Button
            asChild
            className={`bg-[#a3ff12] text-black font-bold hover:bg-opacity-90 transition-all relative group overflow-hidden flex-1 md:flex-none ${
              isMemberInClan ? "opacity-50 cursor-not-allowed" : ""
            }`}
            style={{
              clipPath: "polygon(0 0, 100% 0, 90% 100%, 10% 100%)",
            }}
            disabled={isMemberInClan}
          >
            {!isMemberInClan ? (
              <Link
                href="/clans/create"
                className={`${isMemberInClan ? "cursor-not-allowed" : ""}`}
              >
                <span className="relative z-10">CREATE CLAN</span>
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
              </Link>
            ) : (
              <span className="relative z-10">CREATE CLAN</span>
            )}
          </Button>

          <Button
            variant="outline"
            className="border-[#a3ff12] text-[#a3ff12] hover:bg-[#a3ff12] hover:bg-opacity-10 flex-1 md:flex-none"
          >
            <Filter className="h-4 w-4 mr-2" />
            FILTER
          </Button>
        </div>
      </div>
      {/* Tabs */}
      {loading ? (
        <div className="text-center text-[#a3ff12] py-12">Loading clans...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-12">{error}</div>
      ) : (
        <Tabs defaultValue="most-active" className="mb-8">
          <TabsList className="bg-black border border-[#a3ff12] p-1">
            <TabsTrigger
              value="most-active"
              className="data-[state=active]:bg-[#a3ff12] data-[state=active]:text-black"
            >
              Show all Clans
            </TabsTrigger>
            <TabsTrigger
              value="newest"
              className="data-[state=active]:bg-[#a3ff12] data-[state=active]:text-black"
            >
              Show clans ready for War
            </TabsTrigger>
          </TabsList>
          <TabsContent value="most-active" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClans.map((clan) => (
                <ClanCard key={clan.id} clan={clan} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="newest" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {readyClans
                .sort((a, b) => b.id.localeCompare(a.id))
                .map((clan) => (
                  <ClanCard key={clan.id} clan={clan} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="top-ranked" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClans
                .sort((a, b) => b.wins - a.wins)
                .map((clan) => (
                  <ClanCard key={clan.id} clan={clan} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

interface ClanCardProps {
  clan: ClanCardData;
}

function ClanCard({ clan }: ClanCardProps) {
  const statusLabel =
    clan.status === 0
      ? "Ready for War"
      : clan.status === 1
      ? "At War"
      : "Not Ready";
  return (
    <div className="border border-gray-800 bg-black bg-opacity-60 rounded-lg overflow-hidden hover:border-[#a3ff12] transition-all group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <Image
              src={clan.logo || "/placeholder.svg"}
              alt={clan.name}
              width={80}
              height={80}
              className="w-20 h-20 border-2 border-[#a3ff12] rounded-none"
            />
            <div className="ml-4">
              <h3 className="text-white font-bold text-lg">{clan.name}</h3>
              <p className="text-gray-400 text-sm">Led by {clan.leader}</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  clan.status === 0
                    ? "bg-[#a3ff12] text-black"
                    : clan.status === 1
                    ? "bg-[#FF0000] text-black"
                    : "bg-[#FF0000] text-black"
                }`}
              >
                {statusLabel}
              </span>
            </div>
          </div>
        </div>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {clan.description}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1 text-[#a3ff12]" />
            <span>{clan.members} Members</span>
          </div>
          <div className="flex items-center">
            <Trophy className="h-4 w-4 mr-1 text-[#a3ff12]" />
            <span>{clan.wins} Wins</span>
          </div>
        </div>
        <Button
          asChild
          className="w-full bg-transparent border border-[#a3ff12] text-[#a3ff12] hover:bg-[#a3ff12] hover:text-black transition-all"
        >
          <Link href={`/clans/${clan.id}`}>VIEW CLAN</Link>
        </Button>
      </div>
      <div className="h-1 w-full bg-[#a3ff12] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
    </div>
  );
}
