"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Users, Trophy, Coins } from "lucide-react"

export default function Leaderboard() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Mock data for clan rankings
  const clanRankings = [
    {
      id: "clan-1",
      name: "CYBER WOLVES",
      logo: "/placeholder.svg?height=100&width=100",
      members: 24,
      wins: 18,
      points: 2450,
      rank: 1,
    },
    {
      id: "clan-2",
      name: "NEON KNIGHTS",
      logo: "/placeholder.svg?height=100&width=100",
      members: 32,
      wins: 15,
      points: 2320,
      rank: 2,
    },
    {
      id: "clan-3",
      name: "PIXEL PUNKS",
      logo: "/placeholder.svg?height=100&width=100",
      members: 19,
      wins: 12,
      points: 2180,
      rank: 3,
    },
    {
      id: "clan-4",
      name: "DEFI DEMONS",
      logo: "/placeholder.svg?height=100&width=100",
      members: 27,
      wins: 14,
      points: 2050,
      rank: 4,
    },
    {
      id: "clan-5",
      name: "META MARINES",
      logo: "/placeholder.svg?height=100&width=100",
      members: 21,
      wins: 10,
      points: 1920,
      rank: 5,
    },
    {
      id: "clan-6",
      name: "CHAIN CHAMPIONS",
      logo: "/placeholder.svg?height=100&width=100",
      members: 18,
      wins: 9,
      points: 1780,
      rank: 6,
    },
    {
      id: "clan-7",
      name: "TOKEN TITANS",
      logo: "/placeholder.svg?height=100&width=100",
      members: 15,
      wins: 7,
      points: 1650,
      rank: 7,
    },
    {
      id: "clan-8",
      name: "NFT NINJAS",
      logo: "/placeholder.svg?height=100&width=100",
      members: 22,
      wins: 11,
      points: 1520,
      rank: 8,
    },
  ]

  // Mock data for player rankings
  const playerRankings = [
    {
      id: "player-1",
      name: "0xCyb3r",
      avatar: "/placeholder.svg?height=100&width=100",
      clan: "CYBER WOLVES",
      contributions: 450,
      rank: 1,
    },
    {
      id: "player-2",
      name: "NeonRider",
      avatar: "/placeholder.svg?height=100&width=100",
      clan: "NEON KNIGHTS",
      contributions: 420,
      rank: 2,
    },
    {
      id: "player-3",
      name: "PixelQueen",
      avatar: "/placeholder.svg?height=100&width=100",
      clan: "PIXEL PUNKS",
      contributions: 380,
      rank: 3,
    },
    {
      id: "player-4",
      name: "DemonKing",
      avatar: "/placeholder.svg?height=100&width=100",
      clan: "DEFI DEMONS",
      contributions: 350,
      rank: 4,
    },
    {
      id: "player-5",
      name: "MetaCommander",
      avatar: "/placeholder.svg?height=100&width=100",
      clan: "META MARINES",
      contributions: 320,
      rank: 5,
    },
    {
      id: "player-6",
      name: "ChainMaster",
      avatar: "/placeholder.svg?height=100&width=100",
      clan: "CHAIN CHAMPIONS",
      contributions: 290,
      rank: 6,
    },
    {
      id: "player-7",
      name: "TokenLord",
      avatar: "/placeholder.svg?height=100&width=100",
      clan: "TOKEN TITANS",
      contributions: 260,
      rank: 7,
    },
    {
      id: "player-8",
      name: "NinjaWarrior",
      avatar: "/placeholder.svg?height=100&width=100",
      clan: "NFT NINJAS",
      contributions: 230,
      rank: 8,
    },
  ]

  // Mock data for season rewards
  const seasonRewards = [
    {
      rank: "1st Place",
      rewards: ["5 ETH Prize Pool", "Exclusive Champion NFTs", "Featured on Homepage"],
    },
    {
      rank: "2nd Place",
      rewards: ["2 ETH Prize Pool", "Rare Finalist NFTs", "Special Profile Badge"],
    },
    {
      rank: "3rd Place",
      rewards: ["1 ETH Prize Pool", "Uncommon Finalist NFTs", "Profile Badge"],
    },
    {
      rank: "Top 10",
      rewards: ["0.5 ETH Prize Pool", "Commemorative NFT", "Leaderboard Recognition"],
    },
  ]

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">


      {/* Page header */}
      <div className="mt-12 mb-8">
        <h1 className="text-[#a3ff12] font-extrabold text-4xl md:text-5xl tracking-tighter">LEADERBOARD</h1>
        <p className="text-gray-400 mt-2">Track the top performing clans and players in the current season</p>
      </div>


      {/* Leaderboard Tabs */}
      <Tabs defaultValue="clans" className="w-full">
        <TabsList className="bg-black border border-[#a3ff12] p-1 w-full grid grid-cols-2">
          <TabsTrigger value="clans" className="data-[state=active]:bg-[#a3ff12] data-[state=active]:text-black">
            CLAN RANKINGS
          </TabsTrigger>
          <TabsTrigger value="players" className="data-[state=active]:bg-[#a3ff12] data-[state=active]:text-black">
            PLAYER RANKINGS
          </TabsTrigger>
        </TabsList>

        {/* Clan Rankings Tab */}
        <TabsContent value="clans" className="mt-6">
          <div className="border border-[#a3ff12] bg-black bg-opacity-50 rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800 bg-black bg-opacity-50 text-gray-400 text-sm font-medium">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-5 md:col-span-4">CLAN</div>
              <div className="col-span-2 text-center hidden md:block">MEMBERS</div>
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
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${clan.rank <= 3 ? "bg-[#a3ff12] text-black" : "bg-gray-800 text-white"
                      }`}
                  >
                    {clan.rank}
                  </div>
                </div>

                <div className="col-span-5 md:col-span-4 flex items-center">
                  <Image
                    src={clan.logo || "/placeholder.svg"}
                    alt={clan.name}
                    width={36}
                    height={36}
                    className="rounded-full border-2 border-[#a3ff12]"
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
                  <span className="text-[#a3ff12] font-bold text-lg">{clan.points}</span>
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
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${player.rank <= 3 ? "bg-[#a3ff12] text-black" : "bg-gray-800 text-white"
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
                  <span className="ml-3 text-white font-bold">{player.name}</span>
                </div>

                <div className="col-span-3 md:col-span-4 flex items-center justify-center">
                  <span className="text-white text-sm">{player.clan}</span>
                </div>

                <div className="col-span-3 flex items-center justify-center">
                  <span className="text-[#a3ff12] font-bold">{player.contributions}</span>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
