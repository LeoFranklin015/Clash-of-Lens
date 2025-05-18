"use client";

import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Trophy } from "lucide-react";
import { fetchLeaderBoard } from "@/lib/subgraphHandlers/fetchLeaderBoard";
import { useEffect, useState } from "react";
import { storageClient } from "@/lib/storage-client";

export default function Leaderboard() {
  const [clanRankings, setClanRankings] = useState<any[]>([]);
  const [playerRankings, setPlayerRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const clans = await fetchLeaderBoard(37111);
      if (clans) {
        // Transform clan data for display
        const transformedClans = clans.map((clan: any, index: number) => ({
          id: clan.id,
          name: clan.metadata?.name || "Unnamed Clan",
          logo: clan.metadata?.icon || "/placeholder.svg?height=100&width=100",
          members: clan.members || 0,
          wins: clan.wins || 0,
          points: clan.balance || 0,
          rank: index + 1,
        }));
        setClanRankings(transformedClans);

        // Transform player data for display
      }
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mt-12 mb-8">
          <h1 className="text-[#a3ff12] font-extrabold text-4xl md:text-5xl tracking-tighter">
            LEADERBOARD
          </h1>
          <p className="text-gray-400 mt-2">Loading leaderboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page header */}
      <div className="mt-12 mb-8">
        <h1 className="text-[#a3ff12] font-extrabold text-4xl md:text-5xl tracking-tighter">
          LEADERBOARD
        </h1>
        <p className="text-gray-400 mt-2">
          Track the top performing clans and players in the current season
        </p>
      </div>

      {/* Leaderboard Tabs */}
      <Tabs defaultValue="clans" className="w-full">
        <TabsList className="bg-black border border-[#a3ff12] p-1 w-full grid grid-cols-2">
          <TabsTrigger
            value="clans"
            className="data-[state=active]:bg-[#a3ff12] data-[state=active]:text-black"
          >
            CLAN RANKINGS
          </TabsTrigger>
          <TabsTrigger
            value="players"
            className="data-[state=active]:bg-[#a3ff12] data-[state=active]:text-black"
          >
            PLAYER RANKINGS
          </TabsTrigger>
        </TabsList>

        {/* Clan Rankings Tab */}
        <TabsContent value="clans" className="mt-6">
          <div className="border border-[#a3ff12] bg-black bg-opacity-50 rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800 bg-black bg-opacity-50 text-gray-400 text-sm font-medium">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-5 md:col-span-4">CLAN</div>
              <div className="col-span-2 text-center hidden md:block">
                MEMBERS
              </div>
              <div className="col-span-2 text-center">WINS</div>
              <div className="col-span-4 md:col-span-3 text-center">POINTS</div>
            </div>

            {clanRankings.map((clan) => (
              <Link
                key={clan.id}
                href={`/clans/${clan.id}`}
                className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800 hover:bg-[#a3ff12] hover:bg-opacity-5 transition-colors"
              >
                <div className="col-span-1 flex items-center justify-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      clan.rank <= 3
                        ? "bg-[#a3ff12] text-black"
                        : "bg-gray-800 text-white"
                    }`}
                  >
                    {clan.rank}
                  </div>
                </div>

                <div className="col-span-5 md:col-span-4 flex items-center">
                  <Image
                    src={storageClient.resolve(clan.logo) || "/placeholder.svg"}
                    alt={clan.name}
                    width={36}
                    height={36}
                    className="rounded-full border-2 border-[#a3ff12] object-cover w-10 h-10 bg-white"
                  />
                  <span className="ml-3 text-white font-bold">{clan.name}</span>
                </div>

                <div className="col-span-2 flex items-center justify-center hidden md:flex">
                  <Users className="h-4 w-4 text-[#a3ff12] mr-1" />
                  <span className="text-white">{clan.members}</span>
                </div>

                <div className="col-span-2 flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-[#a3ff12] mr-1" />
                  <span className="text-white">{clan.wins}</span>
                </div>

                <div className="col-span-4 md:col-span-3 flex items-center justify-center">
                  <span className="text-[#a3ff12] font-bold text-lg">
                    {clan.points}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>

        {/* Player Rankings Tab */}
        <TabsContent value="players" className="mt-6">
          <div className="border border-[#a3ff12] bg-black bg-opacity-50 rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800 bg-black bg-opacity-50 text-gray-400 text-sm font-medium">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-5 md:col-span-4">PLAYER</div>
              <div className="col-span-3 md:col-span-4 text-center">CLAN</div>
              <div className="col-span-3 text-center">CONTRIBUTIONS</div>
            </div>

            {playerRankings.map((player) => (
              <Link
                key={player.id}
                href={`/profile/${player.id}`}
                className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800 hover:bg-[#a3ff12] hover:bg-opacity-5 transition-colors"
              >
                <div className="col-span-1 flex items-center justify-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      player.rank <= 3
                        ? "bg-[#a3ff12] text-black"
                        : "bg-gray-800 text-white"
                    }`}
                  >
                    {player.rank}
                  </div>
                </div>

                <div className="col-span-5 md:col-span-4 flex items-center">
                  <Image
                    src={player.avatar || "/placeholder.svg"}
                    alt={player.name}
                    width={36}
                    height={36}
                    className="rounded-full border-2 border-[#a3ff12]"
                  />
                  <span className="ml-3 text-white font-bold">
                    {player.name}
                  </span>
                </div>

                <div className="col-span-3 md:col-span-4 flex items-center justify-center">
                  <span className="text-white text-sm">{player.clan}</span>
                </div>

                <div className="col-span-3 flex items-center justify-center">
                  <span className="text-[#a3ff12] font-bold">
                    {player.contributions}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
