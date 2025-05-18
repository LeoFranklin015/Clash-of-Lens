"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Users,
  Trophy,
  Coins,
  Zap,
  Calendar,
  ArrowRight,
} from "lucide-react";

import {
  fetchGroup,
  fetchGroupMembers,
  joinGroup,
  fetchAccountsBulk,
} from "@lens-protocol/client/actions";
import { client } from "@/lib/client";
import { evmAddress } from "@lens-protocol/react";
import { useEffect, useState } from "react";
import { storageClient } from "@/lib/storage-client";
import { handleOperationWith } from "@lens-protocol/client/ethers";
import { useEthersSigner } from "@/lib/walletClientToSigner";
import { useSession } from "@/components/SessionContext";
import { JoinClanModal } from "@/components/join-clan-modal";
import { useParams } from "next/navigation";
import { checkMemberIsAlreadyInClan } from "@/lib/checkAvailablility";
import { useChainId, useAccount } from "wagmi";
import { useToast } from "@/hooks/use-toast";

export default function ClanPage() {
  const { toast } = useToast();
  const { id: clanGroupId } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [clan, setClan] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fetchedMembers, setFetchedMembers] = useState<any[]>([]); // Using any[] for now, ideally use Lens SDK type

  const signer = useEthersSigner();
  const { sessionClient } = useSession();
  const chainId = useChainId();
  const { address } = useAccount();
  const [isMemberInClan, setIsMemberInClan] = useState(false);

  // Mock data for war history
  const warHistory = [
    {
      id: "war-1",
      opponent: "NEON KNIGHTS",
      result: "WIN",
      date: "April 28, 2023",
      score: { clan: 1240, opponent: 1180 },
    },
    {
      id: "war-2",
      opponent: "PIXEL PUNKS",
      result: "WIN",
      date: "April 12, 2023",
      score: { clan: 980, opponent: 920 },
    },
    {
      id: "war-3",
      opponent: "DEFI DEMONS",
      result: "LOSS",
      date: "March 30, 2023",
      score: { clan: 1050, opponent: 1120 },
    },
    {
      id: "war-4",
      opponent: "META MARINES",
      result: "WIN",
      date: "March 15, 2023",
      score: { clan: 1560, opponent: 1420 },
    },
  ];

  // Mock data for active war
  const activeWar = {
    id: "active-war-1",
    opponent: {
      name: "CHAIN CHAMPIONS",
      logo: "/placeholder.svg?height=100&width=100",
    },
    startDate: "May 10, 2023",
    endDate: "May 17, 2023",
    timeRemaining: "3d 8h",
    score: {
      clan: 1240,
      opponent: 1180,
    },
    metrics: ["Tips", "Followers", "NFT Sales", "Posts"],
  };

  // Fetch real clan data
  const fetchGroupDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchGroup(client, {
        group: evmAddress(clanGroupId as string),
      });
      if (result.isErr()) {
        setError("Failed to fetch clan data");
        setClan(null);
      } else {
        setClan(result.value);
      }

      // Fetch group members (clan)
      const membersResult = await fetchGroupMembers(client, {
        group: evmAddress(clanGroupId as string), // clanGroupId
      });
      if (membersResult.isErr()) {
        setError("Failed to fetch clan members");
        setFetchedMembers([]);
      } else {
        setFetchedMembers(
          membersResult.value.items ? [...membersResult.value.items] : []
        );
      }
    } catch (e) {
      console.error("Error fetching clan data:", e);
      setError("Error fetching clan data");
      setClan(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clanGroupId]);

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

  // Modal handler functions
  const openJoinModal = () => {
    if (isMemberInClan) {
      toast({
        title: "You are already a member of this clan",
        description: "You can't join more than one clan",
        variant: "destructive",
      });
      return;
    }
    setIsJoinModalOpen(true);
  };
  const handleAcceptJoin = async () => {
    // TODO: Implement actual join logic, e.g., API call
    const result = await joinGroup(sessionClient!, {
      group: evmAddress(clanGroupId as string),
    }).andThen(handleOperationWith(signer!));

    if (result.isErr()) {
      console.error("Failed to join clan:", result.error);
    } else {
      console.log("Joined clan successfully");
      setIsJoinModalOpen(false);
      console.log(result.value);
    }

    console.log("Attempting to join clan:", clan?.id);
    setIsJoinModalOpen(false); // Close modal on accept
  };

  if (loading) {
    return (
      <div className="text-center text-white py-12">Loading clan data…</div>
    );
  }
  if (error || !clan) {
    return (
      <div className="text-center text-red-500 py-12">
        {error || "Clan not found."}
      </div>
    );
  }

  // Map API fields
  const clanName = clan.metadata?.name || "Unknown Clan";
  const clanDescription =
    clan.metadata?.description || "No description available.";
  const clanLogo = clan.metadata?.icon
    ? storageClient.resolve(clan.metadata.icon)
    : "/placeholder.svg";
  const clanBanner = !clan.metadata?.coverPicture
    ? storageClient.resolve(clan.metadata.icon)
    : "/placeholder.svg";
  const clanLeader = clan.owner || "Unknown";
  const clanFounded = clan.timestamp
    ? new Date(clan.timestamp).toLocaleDateString()
    : "Unknown";

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Clan Banner */}
      <div className="mt-12 relative rounded-lg overflow-hidden h-48 md:h-64">
        <Image
          src={clanBanner}
          alt={`${clanName} Banner`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
        <div className="absolute bottom-0 left-0 p-6 flex items-center">
          <Image
            src={clanLogo}
            alt={clanName}
            width={80}
            height={80}
            className="rounded-full border-4 border-[#a3ff12] shadow-[0_0_10px_#a3ff12]"
          />
          <div className="ml-4">
            <h1 className="text-white font-extrabold text-3xl md:text-4xl">
              {clanName}
            </h1>
            <p className="text-gray-300">
              Led by {clanLeader} • Founded {clanFounded}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <Button
          onClick={openJoinModal}
          className="bg-[#a3ff12] text-black font-bold hover:bg-opacity-90 transition-all relative group overflow-hidden"
          style={{
            clipPath: "polygon(0 0, 100% 0, 90% 100%, 10% 100%)",
          }}
        >
          <span className="relative z-10 flex items-center">
            JOIN CLAN
            <Users className="ml-2 h-4 w-4" />
          </span>
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
        </Button>
      </div>

      {/* Clan Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-[#a3ff12] bg-black bg-opacity-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Trophy className="h-5 w-5 text-[#a3ff12] mr-2" />
            <h3 className="text-gray-400 text-xs font-medium">WINS</h3>
          </div>
          <p className="text-white text-2xl font-bold">{clan.wins}</p>
        </div>

        <div className="border border-[#a3ff12] bg-black bg-opacity-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Shield className="h-5 w-5 text-[#a3ff12] mr-2" />
            <h3 className="text-gray-400 text-xs font-medium">LOSSES</h3>
          </div>
          <p className="text-white text-2xl font-bold">{clan.losses}</p>
        </div>

        <div className="border border-[#a3ff12] bg-black bg-opacity-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Users className="h-5 w-5 text-[#a3ff12] mr-2" />
            <h3 className="text-gray-400 text-xs font-medium">MEMBERS</h3>
          </div>
          <p className="text-white text-2xl font-bold">{clan.members}</p>
        </div>

        <div className="border border-[#a3ff12] bg-black bg-opacity-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Coins className="h-5 w-5 text-[#a3ff12] mr-2" />
            <h3 className="text-gray-400 text-xs font-medium">TREASURY</h3>
          </div>
          <p className="text-white text-2xl font-bold">{clan.treasury}</p>
        </div>
      </div>

      {/* Clan Description */}
      <div className="mt-8 border border-[#a3ff12] bg-black bg-opacity-50 p-6 rounded-lg">
        <h2 className="text-[#a3ff12] font-bold text-xl mb-4">ABOUT</h2>
        <p className="text-gray-300">{clanDescription}</p>
      </div>

      {/* Clan Tabs */}
      <div className="mt-8">
        <Tabs defaultValue="war-history" className="w-full">
          <TabsList className="bg-black border border-[#a3ff12] p-1 w-full grid grid-cols-4">
            <TabsTrigger
              value="war-history"
              className="data-[state=active]:bg-[#a3ff12] data-[state=active]:text-black"
            >
              WAR HISTORY
            </TabsTrigger>
            <TabsTrigger
              value="members"
              className="data-[state=active]:bg-[#a3ff12] data-[state=active]:text-black"
            >
              MEMBERS
            </TabsTrigger>
            <TabsTrigger
              value="war-room"
              className="data-[state=active]:bg-[#a3ff12] data-[state=active]:text-black"
            >
              WAR ROOM
            </TabsTrigger>
            <TabsTrigger
              value="treasury"
              className="data-[state=active]:bg-[#a3ff12] data-[state=active]:text-black"
            >
              TREASURY
            </TabsTrigger>
          </TabsList>

          {/* War History Tab */}
          <TabsContent value="war-history" className="mt-6">
            <div className="space-y-4">
              {warHistory.map((war) => (
                <div
                  key={war.id}
                  className="border border-gray-800 rounded-lg p-4 hover:border-[#a3ff12] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <span className="text-white font-bold">
                          VS {war.opponent}
                        </span>
                        <span
                          className={`ml-3 px-2 py-1 text-xs font-bold rounded ${
                            war.result === "WIN"
                              ? "bg-[#a3ff12] text-black"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {war.result}
                        </span>
                      </div>
                      <div className="flex items-center mt-2 text-sm text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        {war.date}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#a3ff12] font-bold">
                        {war.score.clan}
                      </div>
                      <div className="text-gray-400">vs</div>
                      <div className="text-white">{war.score.opponent}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fetchedMembers.map((member) => {
                const memberName =
                  member.account.username?.localName ||
                  member.account.metadata?.name ||
                  member.account.address;
                const memberAvatar = member.account.metadata?.picture
                  ? member.account.metadata.picture.startsWith("ipfs://")
                    ? storageClient.resolve(member.account.metadata.picture)
                    : member.account.metadata.picture
                  : "/placeholder.svg";
                const joinDate = member.joinedAt
                  ? new Date(member.joinedAt).toLocaleDateString()
                  : "Unknown";

                // Determine role based on clan owner
                let memberRole = "Member";
                if (
                  clan &&
                  clan.owner &&
                  member.account.address.toLowerCase() ===
                    clan.owner.toLowerCase()
                ) {
                  memberRole = "Leader";
                }

                return (
                  <div
                    key={member.account.address}
                    className="border border-gray-800 rounded-lg p-4 hover:border-[#a3ff12] transition-all flex items-center"
                  >
                    <Image
                      src={memberAvatar}
                      alt={memberName}
                      width={50}
                      height={50}
                      className="rounded-full border-2 border-[#a3ff12]"
                    />
                    <div className="ml-4">
                      <h3 className="text-white font-bold">{memberName}</h3>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            memberRole === "Leader"
                              ? "bg-[#a3ff12] text-black"
                              : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {memberRole}
                        </span>
                        <span className="text-gray-400 text-xs ml-2">
                          Joined {joinDate}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex justify-center">
              <Button
                onClick={openJoinModal}
                className="bg-[#a3ff12] text-black font-bold hover:bg-opacity-90 transition-all relative group overflow-hidden"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 90% 100%, 10% 100%)",
                }}
              >
                <span className="relative z-10 flex items-center">
                  JOIN CLAN
                  <Users className="ml-2 h-4 w-4" />
                </span>
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
              </Button>
            </div>
          </TabsContent>

          {/* War Room Tab */}
          <TabsContent value="war-room" className="mt-6">
            {activeWar ? (
              <div className="border border-[#a3ff12] bg-black bg-opacity-50 rounded-lg p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <div>
                    <h2 className="text-[#a3ff12] font-bold text-xl">
                      ACTIVE WAR
                    </h2>
                    <p className="text-gray-400 mt-1">
                      {activeWar.startDate} - {activeWar.endDate}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 px-4 py-2 bg-black border border-[#a3ff12] rounded-lg">
                    <div className="text-center">
                      <span className="text-white text-sm">TIME REMAINING</span>
                      <div className="text-[#a3ff12] font-bold text-xl">
                        {activeWar.timeRemaining}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-8 my-8">
                  <div className="flex flex-col items-center">
                    <Image
                      src={clanLogo}
                      alt={clanName}
                      width={100}
                      height={100}
                      className="rounded-full border-4 border-[#a3ff12] shadow-[0_0_10px_#a3ff12]"
                    />
                    <h3 className="text-white font-bold mt-2">{clanName}</h3>
                    <div className="text-[#a3ff12] font-bold text-3xl mt-1">
                      {activeWar.score.clan}
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="text-gray-400 text-2xl font-bold">VS</div>
                    <div className="mt-2 px-4 py-1 bg-[#a3ff12] text-black text-xs font-bold rounded-full">
                      BATTLE IN PROGRESS
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <Image
                      src={activeWar.opponent.logo || "/placeholder.svg"}
                      alt={activeWar.opponent.name}
                      width={100}
                      height={100}
                      className="rounded-full border-4 border-gray-700"
                    />
                    <h3 className="text-white font-bold mt-2">
                      {activeWar.opponent.name}
                    </h3>
                    <div className="text-white font-bold text-3xl mt-1">
                      {activeWar.score.opponent}
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-white font-bold mb-4">BATTLE METRICS</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {activeWar.metrics.map((metric, index) => (
                      <div
                        key={index}
                        className="border border-gray-700 rounded-lg p-4 text-center"
                      >
                        <div className="text-gray-400 text-sm">{metric}</div>
                        <div className="text-white font-bold mt-1">
                          {index === 0
                            ? "124"
                            : index === 1
                            ? "37"
                            : index === 2
                            ? "18"
                            : "42"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    className="bg-[#a3ff12] text-black font-bold hover:bg-opacity-90"
                  >
                    <Link href={`/wars/${activeWar.id}`}>
                      <span className="flex items-center">
                        ENTER WAR ARENA
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="border-[#a3ff12] text-[#a3ff12] hover:bg-[#a3ff12] hover:bg-opacity-10"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    CONTRIBUTE NOW
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Shield className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white font-bold text-xl mb-2">
                  NO ACTIVE WAR
                </h3>
                <p className="text-gray-400 mb-6">
                  This clan is not currently engaged in battle
                </p>
                <Button
                  asChild
                  className="bg-[#a3ff12] text-black font-bold hover:bg-opacity-90"
                >
                  <Link href="/wars/create">START A WAR</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Treasury Tab */}
          <TabsContent value="treasury" className="mt-6">
            <div className="border border-[#a3ff12] bg-black bg-opacity-50 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[#a3ff12] font-bold text-xl">
                  CLAN TREASURY
                </h2>
                <div className="px-4 py-2 bg-black border border-[#a3ff12] rounded-lg">
                  <div className="text-center">
                    <span className="text-white text-sm">TOTAL BALANCE</span>
                    <div className="text-[#a3ff12] font-bold text-xl">
                      {clan.treasury}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border border-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-bold">War Rewards</h3>
                      <p className="text-gray-400 text-sm">
                        From victory against NEON KNIGHTS
                      </p>
                    </div>
                    <div className="text-[#a3ff12] font-bold">+0.8 ETH</div>
                  </div>
                </div>

                <div className="border border-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-bold">
                        Member Contributions
                      </h3>
                      <p className="text-gray-400 text-sm">Monthly donations</p>
                    </div>
                    <div className="text-[#a3ff12] font-bold">+0.5 ETH</div>
                  </div>
                </div>

                <div className="border border-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-bold">NFT Sales</h3>
                      <p className="text-gray-400 text-sm">Clan merchandise</p>
                    </div>
                    <div className="text-[#a3ff12] font-bold">+1.2 ETH</div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-white font-bold mb-4">
                  TREASURY ALLOCATION
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-gray-800 rounded-lg p-4 text-center">
                    <div className="text-gray-400 text-sm">WAR CHEST</div>
                    <div className="text-white font-bold mt-1">1.5 ETH</div>
                    <div className="w-full bg-gray-800 h-2 mt-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#a3ff12] h-full rounded-full"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="border border-gray-800 rounded-lg p-4 text-center">
                    <div className="text-gray-400 text-sm">REWARDS POOL</div>
                    <div className="text-white font-bold mt-1">0.7 ETH</div>
                    <div className="w-full bg-gray-800 h-2 mt-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#a3ff12] h-full rounded-full"
                        style={{ width: "28%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="border border-gray-800 rounded-lg p-4 text-center">
                    <div className="text-gray-400 text-sm">DEVELOPMENT</div>
                    <div className="text-white font-bold mt-1">0.3 ETH</div>
                    <div className="w-full bg-gray-800 h-2 mt-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#a3ff12] h-full rounded-full"
                        style={{ width: "12%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Render the modal */}
      {clan && (
        <JoinClanModal
          isOpen={isJoinModalOpen}
          onOpenChange={setIsJoinModalOpen}
          onAccept={handleAcceptJoin}
          clanName={clanName}
        />
      )}
    </div>
  );
}
