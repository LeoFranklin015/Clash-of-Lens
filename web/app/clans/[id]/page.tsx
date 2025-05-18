"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Trophy, Zap, Calendar, ArrowRight } from "lucide-react";

import {
  fetchGroup,
  fetchGroupMembers,
  joinGroup,
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
import { useChainId } from "wagmi";
import { useToast } from "@/hooks/use-toast";
import { Group } from "@/lib/types";
import { GroupTreasury } from "@/components/GroupTreasury";
import { fetchWarLogs } from "@/lib/subgraphHandlers/fetchWarLogs";

export default function ClanPage() {
  const { toast } = useToast();
  const { id: clanGroupId } = useParams();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warLogs, setWarLogs] = useState<any[]>([]);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [groupMembers, setGroupMembers] = useState<any[]>([]); // Using any[] for now, ideally use Lens SDK type
  const [clanDetails, setClanDetails] = useState<Record<string, Group>>({});

  interface WarLog {
    id: string;
    clan1: { id: string };
    clan2: { id: string };
    result: number;
    timestamp: string;
  }

  const signer = useEthersSigner();
  const { sessionClient, profile } = useSession();
  const chainId = useChainId();
  const [isMemberInClan, setIsMemberInClan] = useState(false);

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
  const handleFetchGroup = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchGroup(client, {
        group: evmAddress(clanGroupId as string),
      });
      if (result.isErr()) {
        setError("Failed to fetch clan data");
        setGroup(null);
      } else {
        setGroup(result.value as Group);
      }
    } catch (e) {
      console.error("Error fetching clan data:", e);
      setError("Error fetching clan data");
      setGroup(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchGroupMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch group members (clan)
      const membersResult = await fetchGroupMembers(client, {
        group: evmAddress(clanGroupId as string), // clanGroupId
      });
      if (membersResult.isErr()) {
        setError("Failed to fetch clan members");
        setGroupMembers([]);
      } else {
        setGroupMembers(
          membersResult.value.items ? [...membersResult.value.items] : []
        );
      }
    } catch (e) {
      console.error("Error fetching group members:", e);
      setError("Error fetching group members");
      setGroupMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClanDetails = async (clanAddress: string) => {
    try {
      const result = await fetchGroup(client, {
        group: evmAddress(clanAddress),
      });
      if (result.isOk()) {
        setClanDetails((prev) => ({
          ...prev,
          [clanAddress.toLowerCase()]: result.value as Group,
        }));
      }
    } catch (e) {
      console.error("Error fetching clan details:", e);
    }
  };

  const handleFetchWarLogs = async () => {
    const warLogs = await fetchWarLogs(chainId, clanGroupId as `0x${string}`);
    setWarLogs(warLogs);

    // Fetch details for all unique clans in war logs
    const uniqueClans = new Set<string>();
    warLogs.forEach((war: WarLog) => {
      uniqueClans.add(war.clan1.id.toLowerCase());
      uniqueClans.add(war.clan2.id.toLowerCase());
    });

    // Fetch details for each unique clan
    for (const clanAddress of uniqueClans) {
      await fetchClanDetails(clanAddress);
    }
  };

  useEffect(() => {
    handleFetchGroup();
    handleFetchGroupMembers();
    handleFetchWarLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clanGroupId]);

  useEffect(() => {
    const checkMembership = async () => {
      if (profile?.address) {
        const res: boolean = await checkMemberIsAlreadyInClan(
          profile.address as `0x${string}`,
          chainId
        );
        setIsMemberInClan(res);
      }
    };

    checkMembership();
  }, [profile?.address, chainId]);

  // Modal handler functions
  const openJoinModal = () => {
    if (isMemberInClan) {
      toast({
        title: "You are already a member of this clan",
        description: "You can't join more than one clan",
        variant: "default",
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

    console.log("Attempting to join clan:", group?.address);
    setIsJoinModalOpen(false); // Close modal on accept
  };

  if (loading) {
    return (
      <div className="text-center text-white py-12">Loading clan data…</div>
    );
  }
  if (error || !group || groupMembers.length === 0) {
    return (
      <div className="text-center text-red-500 py-12">
        {error || "Clan not found."}
      </div>
    );
  }

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Clan Banner */}
      <div className="mt-12 relative rounded-lg overflow-hidden h-48 md:h-64">
        <Image
          src={
            !group.metadata?.coverPicture
              ? storageClient.resolve(group.metadata.icon)
              : "/placeholder.svg"
          }
          alt={`${group.metadata?.name} Banner`}
          fill
          className="bg-white object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
        <div className="absolute bottom-0 left-0 p-6 flex items-center justify-between">
          <Image
            src={
              group.metadata?.icon
                ? storageClient.resolve(group.metadata.icon)
                : "/placeholder.svg"
            }
            alt={group.metadata?.name || "Unknown Clan"}
            width={80}
            height={80}
            className="rounded-full border-4 border-[#a3ff12] shadow-[0_0_10px_#a3ff12]"
          />
          <div className="flex justify-between w-full items-center mt-4">
            <div className="ml-5">
              <h1 className="text-white font-extrabold text-3xl md:text-4xl">
                {group.metadata?.name || "Unknown Clan"}
              </h1>
              <p className="text-gray-300">
                Led by {group.owner || "Unknown"} • Founded{" "}
                {group.timestamp
                  ? new Date(group.timestamp).toLocaleDateString()
                  : "Unknown"}
              </p>
              <Button
                onClick={openJoinModal}
                className="cursor-pointer mt-3  bg-[#a3ff12] text-black font-bold hover:bg-opacity-90 transition-all relative group overflow-hidden"
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
          </div>
        </div>
      </div>

      {/* Clan Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-[#a3ff12] bg-black bg-opacity-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Trophy className="h-5 w-5 text-[#a3ff12] mr-2" />
            <h3 className="text-gray-400 text-xs font-medium">WINS</h3>
          </div>
          <p className="text-white text-2xl font-bold">{0}</p>
        </div>

        <div className="border border-[#a3ff12] bg-black bg-opacity-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Shield className="h-5 w-5 text-[#a3ff12] mr-2" />
            <h3 className="text-gray-400 text-xs font-medium">LOSSES</h3>
          </div>
          <p className="text-white text-2xl font-bold">{0}</p>
        </div>

        <div className="border border-[#a3ff12] bg-black bg-opacity-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Users className="h-5 w-5 text-[#a3ff12] mr-2" />
            <h3 className="text-gray-400 text-xs font-medium">MEMBERS</h3>
          </div>
          <p className="text-white text-2xl font-bold">{groupMembers.length}</p>
        </div>

        <GroupTreasury groupAddress={group.address} />
      </div>

      {/* Clan Description */}
      <div className="mt-8 border border-[#a3ff12] bg-black bg-opacity-50 p-6 rounded-lg">
        <h2 className="text-[#a3ff12] font-bold text-xl mb-4">ABOUT</h2>
        <p className="text-gray-300">
          {group.metadata?.description || "No description available."}
        </p>
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
              {warLogs.map((war: WarLog) => {
                const isClan1 =
                  war.clan1.id.toLowerCase() ===
                  clanGroupId?.toString().toLowerCase();
                const opponentClan = isClan1 ? war.clan2 : war.clan1;
                const result =
                  war.result === 0
                    ? "IN WAR"
                    : (war.result === 1 && isClan1) ||
                      (war.result === 2 && !isClan1)
                    ? "WIN"
                    : "LOSS";
                const date = new Date(
                  parseInt(war.timestamp) * 1000
                ).toLocaleDateString();

                const opponentDetails =
                  clanDetails[opponentClan.id.toLowerCase()];
                const opponentName =
                  opponentDetails?.metadata?.name ||
                  `${opponentClan.id.slice(0, 6)}...${opponentClan.id.slice(
                    -4
                  )}`;
                const opponentIcon = opponentDetails?.metadata?.icon
                  ? storageClient.resolve(opponentDetails.metadata.icon)
                  : "/placeholder.svg";

                return (
                  <div
                    key={war.id}
                    className="border border-gray-800 rounded-lg p-4 hover:border-[#a3ff12] transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Image
                          src={opponentIcon}
                          alt={opponentName}
                          width={40}
                          height={40}
                          className="rounded-full border-2 border-[#a3ff12]"
                        />
                        <div className="ml-4">
                          <div className="flex items-center">
                            <span className="text-white font-bold">
                              {opponentName}
                            </span>
                            <span
                              className={`ml-3 px-2 py-1 text-xs font-bold rounded ${
                                result === "WIN"
                                  ? "bg-[#a3ff12] text-black"
                                  : result === "LOSS"
                                  ? "bg-red-500 text-white"
                                  : "bg-yellow-500 text-black"
                              }`}
                            >
                              {result}
                            </span>
                          </div>
                          <div className="flex items-center mt-2 text-sm text-gray-400">
                            <Calendar className="h-4 w-4 mr-1" />
                            {date}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupMembers.map((member) => {
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
                  group &&
                  group.owner &&
                  member.account.address.toLowerCase() ===
                    group.owner.toLowerCase()
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
                className="cursor-pointer bg-[#a3ff12] text-black font-bold hover:bg-opacity-90 transition-all relative group overflow-hidden"
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
            {(() => {
              const currentWar = warLogs.find((war) => war.result === 0);

              if (currentWar) {
                const isClan1 =
                  currentWar.clan1.id.toLowerCase() ===
                  clanGroupId?.toString().toLowerCase();
                const opponentClan = isClan1
                  ? currentWar.clan2
                  : currentWar.clan1;
                const opponentDetails =
                  clanDetails[opponentClan.id.toLowerCase()];
                const opponentName =
                  opponentDetails?.metadata?.name ||
                  `${opponentClan.id.slice(0, 6)}...${opponentClan.id.slice(
                    -4
                  )}`;
                const opponentIcon = opponentDetails?.metadata?.icon
                  ? storageClient.resolve(opponentDetails.metadata.icon)
                  : "/placeholder.svg";
                const currentClanDetails =
                  clanDetails[clanGroupId?.toString().toLowerCase() || ""];

                return (
                  <div className="border border-[#a3ff12] bg-black bg-opacity-50 rounded-lg p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                      <div>
                        <h2 className="text-[#a3ff12] font-bold text-xl">
                          ACTIVE WAR
                        </h2>
                        <p className="text-gray-400 mt-1">
                          Started{" "}
                          {new Date(
                            parseInt(currentWar.timestamp) * 1000
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0 px-4 py-2 bg-black border border-[#a3ff12] rounded-lg">
                        <div className="text-center">
                          <span className="text-white text-sm">WAR STATUS</span>
                          <div className="text-[#a3ff12] font-bold text-xl">
                            IN PROGRESS
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 my-8">
                      <div className="flex flex-col items-center">
                        <Image
                          src={
                            currentClanDetails?.metadata?.icon
                              ? storageClient.resolve(
                                  currentClanDetails.metadata.icon
                                )
                              : "/placeholder.svg"
                          }
                          alt={
                            currentClanDetails?.metadata?.name || "Current Clan"
                          }
                          width={100}
                          height={100}
                          className="rounded-full border-4 border-[#a3ff12] shadow-[0_0_10px_#a3ff12]"
                        />
                        <h3 className="text-white font-bold mt-2">
                          {currentClanDetails?.metadata?.name || "Current Clan"}
                        </h3>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="text-gray-400 text-2xl font-bold">
                          VS
                        </div>
                        <div className="mt-2 px-4 py-1 bg-[#a3ff12] text-black text-xs font-bold rounded-full">
                          BATTLE IN PROGRESS
                        </div>
                      </div>

                      <div className="flex flex-col items-center">
                        <Image
                          src={opponentIcon}
                          alt={opponentName}
                          width={100}
                          height={100}
                          className="rounded-full border-4 border-gray-700"
                        />
                        <h3 className="text-white font-bold mt-2">
                          {opponentName}
                        </h3>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
                      <Button
                        asChild
                        className="bg-[#a3ff12] text-black font-bold hover:bg-opacity-90"
                      >
                        <Link href={`/wars/${currentWar.id}`}>
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
                );
              }

              return (
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
              );
            })()}
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
                    <div className="text-[#a3ff12] font-bold text-xl">{0}</div>
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
      {group && (
        <JoinClanModal
          isOpen={isJoinModalOpen}
          onOpenChange={setIsJoinModalOpen}
          onAccept={handleAcceptJoin}
          clanName={group.metadata?.name || "Unknown Clan"}
        />
      )}
    </div>
  );
}
