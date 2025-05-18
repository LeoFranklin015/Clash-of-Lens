"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Trophy, Clock, ArrowRight } from "lucide-react";
import { useChainId } from "wagmi";
import { fetchWars } from "@/lib/subgraphHandlers/fetchWars";
import { useEffect, useState } from "react";
import { fetchGroup } from "@lens-protocol/client/actions";
import { client } from "@/lib/client";
import { evmAddress } from "@lens-protocol/client";
import { storageClient } from "@/lib/storage-client";

export default function WarsPage() {
  const chainId = useChainId();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [wars, setWars] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [clanDetails, setClanDetails] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const fetchClanDetails = async (clanAddress: string) => {
    try {
      const result = await fetchGroup(client, {
        group: evmAddress(clanAddress),
      });
      if (result.isOk()) {
        setClanDetails((prev) => ({
          ...prev,
          [clanAddress.toLowerCase()]: result.value,
        }));
      }
    } catch (e) {
      console.error("Error fetching clan details:", e);
    }
  };

  const fetchWarData = async () => {
    setLoading(true);
    try {
      const wars = await fetchWars(chainId);
      setWars(wars);

      // Fetch details for all unique clans in wars
      const uniqueClans = new Set<string>();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      wars.forEach((war: any) => {
        uniqueClans.add(war.clan1.id.toLowerCase());
        uniqueClans.add(war.clan2.id.toLowerCase());
      });

      // Fetch details for each unique clan
      for (const clanAddress of uniqueClans) {
        await fetchClanDetails(clanAddress);
      }
    } catch (error) {
      console.error("Error fetching war data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarData();
  }, [chainId]);

  if (loading) {
    return (
      <div className="text-center text-white py-12">Loading war data...</div>
    );
  }

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page header */}
      <div className="mt-12 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-[#a3ff12] font-extrabold text-4xl md:text-5xl tracking-tighter">
            WAR ARENA
          </h1>
          <p className="text-gray-400 mt-2">
            View ongoing battles, join the fight, and contribute to your
            clan&apos;s victory
          </p>
        </div>

        <div className="mt-4 md:mt-0">
          <Button
            asChild
            className="bg-[#a3ff12] text-black font-bold hover:bg-opacity-90 transition-all relative group overflow-hidden"
            style={{
              clipPath: "polygon(0 0, 100% 0, 90% 100%, 10% 100%)",
            }}
          >
            <Link href="/wars/create">
              <span className="relative z-10 flex items-center">
                START A WAR
                <Zap className="ml-2 h-4 w-4" />
              </span>
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
            </Link>
          </Button>
        </div>
      </div>

      {/* War Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="bg-black border border-[#a3ff12] p-1 w-full grid grid-cols-2">
          <TabsTrigger
            value="active"
            className="cursor-pointer data-[state=active]:bg-[#a3ff12] data-[state=active]:text-black"
          >
            ACTIVE WARS
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="cursor-pointer data-[state=active]:bg-[#a3ff12] data-[state=active]:text-black"
          >
            COMPLETED WARS
          </TabsTrigger>
        </TabsList>

        {/* Active Wars Tab */}
        <TabsContent value="active" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {wars.map((war) => {
              const clan1Details = clanDetails[war.clan1.id.toLowerCase()];
              const clan2Details = clanDetails[war.clan2.id.toLowerCase()];
              const startDate = new Date(
                parseInt(war.timestamp) * 1000
              ).toLocaleDateString();
              const endDate = new Date(
                (parseInt(war.timestamp) + 24 * 60 * 60) * 1000
              ).toLocaleDateString();
              const timeRemaining = Math.max(
                0,
                Math.floor(
                  (parseInt(war.timestamp) + 24 * 60 * 60 - Date.now() / 1000) /
                    (60 * 60)
                )
              );

              return (
                <Link
                  key={war.id}
                  href={`/wars/${war.id}`}
                  className="block border border-gray-800 bg-black bg-opacity-60 rounded-lg overflow-hidden hover:border-[#a3ff12] transition-all group"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-white font-bold text-lg">CLAN WAR</h3>
                      <div className="px-3 py-1 bg-[#a3ff12] text-black text-xs font-bold rounded-full flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {timeRemaining}h REMAINING
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <div className="flex flex-col items-center">
                        <Image
                          src={
                            clan1Details?.metadata?.icon
                              ? storageClient.resolve(
                                  clan1Details.metadata.icon
                                )
                              : "/placeholder.svg"
                          }
                          alt={clan1Details?.metadata?.name || "Unknown Clan"}
                          width={60}
                          height={60}
                          className="rounded-full border-2 border-[#a3ff12]"
                        />
                        <span className="text-white text-sm mt-2">
                          {clan1Details?.metadata?.name || "Unknown Clan"}
                        </span>
                        <span className="text-[#a3ff12] font-bold text-xl">
                          {war.score?.clan1 || 0}
                        </span>
                      </div>

                      <div className="text-center">
                        <div className="text-gray-500 text-lg font-bold">
                          VS
                        </div>
                        <div className="text-white text-xs mt-1">
                          {startDate}
                        </div>
                        <div className="text-white text-xs">to {endDate}</div>
                      </div>

                      <div className="flex flex-col items-center">
                        <Image
                          src={
                            clan2Details?.metadata?.icon
                              ? storageClient.resolve(
                                  clan2Details.metadata.icon
                                )
                              : "/placeholder.svg"
                          }
                          alt={clan2Details?.metadata?.name || "Unknown Clan"}
                          width={60}
                          height={60}
                          className="rounded-full border-2 border-[#a3ff12]"
                        />
                        <span className="text-white text-sm mt-2">
                          {clan2Details?.metadata?.name || "Unknown Clan"}
                        </span>
                        <span className="text-[#a3ff12] font-bold text-xl">
                          {war.score?.clan2 || 0}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">
                        {war.score?.clan1 > war.score?.clan2
                          ? (clan1Details?.metadata?.name || "Clan 1") +
                            " is leading"
                          : war.score?.clan2 > war.score?.clan1
                          ? (clan2Details?.metadata?.name || "Clan 2") +
                            " is leading"
                          : "Clans are tied"}
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-[#a3ff12] transition-colors" />
                    </div>
                  </div>
                  <div className="h-1 w-full bg-[#a3ff12] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </Link>
              );
            })}
          </div>
        </TabsContent>

        {/* Completed Wars Tab */}
        <TabsContent value="completed" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {wars
              .filter((war) => war.result !== 0)
              .map((war) => {
                const clan1Details = clanDetails[war.clan1.id.toLowerCase()];
                const clan2Details = clanDetails[war.clan2.id.toLowerCase()];
                const date = new Date(
                  parseInt(war.timestamp) * 1000
                ).toLocaleDateString();
                const winner = war.result === 1 ? "clan1" : "clan2";

                return (
                  <div
                    key={war.id}
                    className="border border-gray-800 bg-black bg-opacity-60 rounded-lg overflow-hidden hover:border-[#a3ff12] transition-all group"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-bold text-lg">
                          COMPLETED WAR
                        </h3>
                        <div className="text-gray-400 text-sm">{date}</div>
                      </div>

                      <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col items-center">
                          <div className="relative">
                            <Image
                              src={
                                clan1Details?.metadata?.icon
                                  ? storageClient.resolve(
                                      clan1Details.metadata.icon
                                    )
                                  : "/placeholder.svg"
                              }
                              alt={
                                clan1Details?.metadata?.name || "Unknown Clan"
                              }
                              width={60}
                              height={60}
                              className={`rounded-full border-2 ${
                                winner === "clan1"
                                  ? "border-[#a3ff12]"
                                  : "border-gray-700"
                              }`}
                            />
                            {winner === "clan1" && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#a3ff12] rounded-full flex items-center justify-center">
                                <Trophy className="h-3 w-3 text-black" />
                              </div>
                            )}
                          </div>
                          <span className="text-white text-sm mt-2">
                            {clan1Details?.metadata?.name || "Unknown Clan"}
                          </span>
                          <span
                            className={`font-bold text-xl ${
                              winner === "clan1"
                                ? "text-[#a3ff12]"
                                : "text-white"
                            }`}
                          >
                            {war.score?.clan1 || 0}
                          </span>
                        </div>

                        <div className="text-center">
                          <div className="text-gray-500 text-lg font-bold">
                            VS
                          </div>
                          <div className="text-white text-xs mt-1">
                            FINAL SCORE
                          </div>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="relative">
                            <Image
                              src={
                                clan2Details?.metadata?.icon
                                  ? storageClient.resolve(
                                      clan2Details.metadata.icon
                                    )
                                  : "/placeholder.svg"
                              }
                              alt={
                                clan2Details?.metadata?.name || "Unknown Clan"
                              }
                              width={60}
                              height={60}
                              className={`rounded-full border-2 ${
                                winner === "clan2"
                                  ? "border-[#a3ff12]"
                                  : "border-gray-700"
                              }`}
                            />
                            {winner === "clan2" && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#a3ff12] rounded-full flex items-center justify-center">
                                <Trophy className="h-3 w-3 text-black" />
                              </div>
                            )}
                          </div>
                          <span className="text-white text-sm mt-2">
                            {clan2Details?.metadata?.name || "Unknown Clan"}
                          </span>
                          <span
                            className={`font-bold text-xl ${
                              winner === "clan2"
                                ? "text-[#a3ff12]"
                                : "text-white"
                            }`}
                          >
                            {war.score?.clan2 || 0}
                          </span>
                        </div>
                      </div>

                      <div className="text-center">
                        <span className="text-gray-400 text-sm">
                          {winner === "clan1"
                            ? `${
                                clan1Details?.metadata?.name || "Clan 1"
                              } won by ${
                                (war.score?.clan1 || 0) -
                                (war.score?.clan2 || 0)
                              } points`
                            : `${
                                clan2Details?.metadata?.name || "Clan 2"
                              } won by ${
                                (war.score?.clan2 || 0) -
                                (war.score?.clan1 || 0)
                              } points`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
