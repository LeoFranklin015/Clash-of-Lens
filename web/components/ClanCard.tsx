"use client";

import { ClanCardData } from "@/app/clans/page";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, Trophy } from "lucide-react";
import { useAccount } from "wagmi";
import { useWriteContract } from "wagmi";
import { useEffect, useState } from "react";
import { useChainId } from "wagmi";
import { contractsConfig } from "@/lib/contractsConfig";
import { useSession } from "./SessionContext";
import { Clan } from "@/lib/types";
import { client } from "@/lib/client";
import { evmAddress } from "@lens-protocol/react";
import { fetchGroups } from "@lens-protocol/client/actions";

function SetReadyButton({ clanAddress }: { clanAddress: `0x${string}` }) {
  const { writeContract, isPending, isError, isSuccess } = useWriteContract();
  const chainId = useChainId();
  const [isLoading, setIsLoading] = useState(false);

  const handleSetReady = async () => {
    try {
      setIsLoading(true);
      await writeContract({
        address:
          (contractsConfig[chainId as keyof typeof contractsConfig]
            ?.contractAddress as `0x${string}`) ||
          contractsConfig[232].contractAddress,
        abi:
          contractsConfig[chainId as keyof typeof contractsConfig]
            ?.contractABI || contractsConfig[232].contractABI,
        functionName: "setReady",
        args: [clanAddress],
      });
    } catch (error) {
      console.error("Error setting clan ready:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSetReady}
      disabled={isPending || isLoading}
      className="cursor-pointer w-full bg-transparent border border-[#a3ff12] text-[#a3ff12] hover:bg-[#a3ff12] hover:text-black transition-all"
    >
      {isPending || isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-[#a3ff12] border-t-transparent rounded-full animate-spin" />
          Setting Ready...
        </div>
      ) : isSuccess ? (
        "Ready Set! Please refresh the page"
      ) : isError ? (
        "Error Setting Ready"
      ) : (
        "Set Ready"
      )}
    </Button>
  );
}

function WageWarButton({
  clanAddress,
  opponentAddress,
}: {
  clanAddress: `0x${string}`;
  opponentAddress: `0x${string}`;
}) {
  console.log(clanAddress, opponentAddress);
  const { writeContract, isPending, isError, isSuccess } = useWriteContract();
  const chainId = useChainId();
  const [isLoading, setIsLoading] = useState(false);

  const handleSetReady = async () => {
    try {
      setIsLoading(true);
      await writeContract({
        address:
          (contractsConfig[chainId as keyof typeof contractsConfig]
            ?.contractAddress as `0x${string}`) ||
          contractsConfig[232].contractAddress,
        abi:
          contractsConfig[chainId as keyof typeof contractsConfig]
            ?.contractABI || contractsConfig[232].contractABI,
        functionName: "wageWar",
        args: [clanAddress, opponentAddress],
      });
    } catch (error) {
      console.error("Error setting clan ready:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSetReady}
      disabled={isPending || isLoading}
      className="cursor-pointer w-full bg-transparent border border-[#a3ff12] text-[#a3ff12] hover:bg-[#a3ff12] hover:text-black transition-all"
    >
      {isPending || isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-[#a3ff12] border-t-transparent rounded-full animate-spin" />
          Waging War...
        </div>
      ) : isSuccess ? (
        "War Waged! Please refresh the page"
      ) : isError ? (
        "Error Waging War"
      ) : (
        "Wage War"
      )}
    </Button>
  );
}

interface ClanCardProps {
  clan: ClanCardData;
}

export function ClanCard({ clan }: ClanCardProps) {
  function statusToLabel(status: number) {
    return status === 0
      ? "Ready for War"
      : status === 1
      ? "At War"
      : "Not Ready";
  }
  const statusLabel = statusToLabel(clan.status);
  const { address } = useAccount();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userClan, setUserClan] = useState<any | null>(null);
  const isOwner =
    address && clan.owner && address.toLowerCase() === clan.owner.toLowerCase();
  const isNotReady = clan.status !== 0;
  const isAlreadyInWar = clan.status === 1;
  const { profile } = useSession();
  const chainId = useChainId();

  // Fetch user's clan when profile or chainId changes
  useEffect(() => {
    const fetchClansFromSubgraph = async (
      chainId: keyof typeof contractsConfig
    ) => {
      const subgraph = contractsConfig[chainId]?.subgraphUrl;
      const res = await fetch(subgraph, {
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
      const clansFromSubgraph: Clan[] = json.data?.clans || [];
      return clansFromSubgraph;
    };

    const fetchUserClan = async () => {
      setUserClan(null);
      if (!profile?.address || !chainId) return;
      const clans = await fetchClansFromSubgraph(
        chainId as keyof typeof contractsConfig
      );
      const result = await fetchGroups(client, {
        filter: {
          member: evmAddress(profile.address),
        },
      });
      if (result.isErr()) {
        return console.error(result.error);
      }
      // Find the first matching clan
      const userclan = result.value.items.find((item) => {
        if (!item || !item.address) return false;
        return clans.find(
          (clan) => clan.id.toLowerCase() === item.address.toLowerCase()
        );
      });
      if (userclan) {
        console.log(userclan);
        setUserClan({
          id: userclan.address,
          name: userclan.metadata?.name || "Unnamed Clan",
          feedAddress: userclan.feed?.address,
          logo: userclan.metadata?.icon || "/placeholder.svg",
        });
      }
    };
    if (profile && chainId) {
      fetchUserClan();
    } else {
      setUserClan(null);
    }
  }, []);

  return (
    <div className="border flex flex-col items-between border-gray-800 bg-black bg-opacity-60 rounded-lg overflow-hidden hover:border-[#a3ff12] transition-all group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <Image
              src={clan.logo || "/placeholder.svg"}
              alt={clan.name}
              width={80}
              height={80}
              className="w-20 bg-white h-20 border-2 border-[#a3ff12] rounded-none"
            />
            <div className="ml-4">
              <h3 className="text-white font-bold text-lg">{clan.name}</h3>
              <p className="text-gray-400 text-sm">
                Led by {clan.leader.slice(0, 6)}...{clan.leader.slice(-4)}
              </p>
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
        {isNotReady && !isAlreadyInWar && isOwner && (
          <SetReadyButton clanAddress={clan.id as `0x${string}`} />
        )}
        {!isNotReady && !isAlreadyInWar && !isOwner && (
          <WageWarButton
            clanAddress={userClan?.id as `0x${string}`}
            opponentAddress={clan.id as `0x${string}`}
          />
        )}
        <Button
          asChild
          className="w-full mt-2 bg-transparent border border-[#a3ff12] text-[#a3ff12] hover:bg-[#a3ff12] hover:text-black transition-all"
        >
          <Link href={`/clans/${clan.id}`}>VIEW CLAN</Link>
        </Button>
      </div>
      {/* <div className="h-1 w-full bg-[#a3ff12] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div> */}
    </div>
  );
}
