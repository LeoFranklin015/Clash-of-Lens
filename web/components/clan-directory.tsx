"use client"

import { useState, } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Users, Trophy, Search, Filter } from "lucide-react"

export default function ClanDirectory() {
  const [searchQuery, setSearchQuery] = useState("")


  const clans = [
    {
      id: "clan-1",
      name: "CYBER WOLVES",
      logo: "/placeholder.svg?height=100&width=100",
      leader: "0xCyb3r",
      members: 24,
      wins: 18,
      description: "The most feared clan in the digital realm. We hunt in packs and never back down.",
    },
    {
      id: "clan-2",
      name: "NEON KNIGHTS",
      logo: "/placeholder.svg?height=100&width=100",
      leader: "Sir_Pixel",
      members: 32,
      wins: 15,
      description: "Guardians of the blockchain. Our shields never break and our swords never dull.",
    },
    {
      id: "clan-3",
      name: "PIXEL PUNKS",
      logo: "/placeholder.svg?height=100&width=100",
      leader: "Punk_Master",
      members: 19,
      wins: 12,
      description: "Rebels with a cause. We disrupt the status quo and redefine the game.",
    },
    {
      id: "clan-4",
      name: "DEFI DEMONS",
      logo: "/placeholder.svg?height=100&width=100",
      leader: "DeFi_Lord",
      members: 27,
      wins: 14,
      description: "Masters of financial warfare. We leverage our assets for maximum destruction.",
    },
    {
      id: "clan-5",
      name: "META MARINES",
      logo: "/placeholder.svg?height=100&width=100",
      leader: "Captain_Meta",
      members: 21,
      wins: 10,
      description: "Disciplined warriors of the metaverse. We conquer digital territories with precision.",
    },
    {
      id: "clan-6",
      name: "CHAIN CHAMPIONS",
      logo: "/placeholder.svg?height=100&width=100",
      leader: "BlockMaster",
      members: 18,
      wins: 9,
      description: "Champions of the blockchain. We forge links that can never be broken.",
    },
    {
      id: "clan-7",
      name: "TOKEN TITANS",
      logo: "/placeholder.svg?height=100&width=100",
      leader: "TokenKing",
      members: 15,
      wins: 7,
      description: "Giants of the crypto world. We crush our opponents with sheer economic power.",
    },
    {
      id: "clan-8",
      name: "NFT NINJAS",
      logo: "/placeholder.svg?height=100&width=100",
      leader: "ShadowNFT",
      members: 22,
      wins: 11,
      description: "Silent but deadly. We strike from the shadows and disappear without a trace.",
    },
  ]

  const filteredClans = clans.filter((clan) => clan.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">


      {/* Page header */}
      <div className="mt-12 mb-8">
        <h1 className="text-[#a3ff12] font-extrabold text-4xl md:text-5xl tracking-tighter">CLAN DIRECTORY</h1>
        <p className="text-gray-400 mt-2">Join an existing clan or create your own to start battling for supremacy</p>
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
            className="bg-[#a3ff12] text-black font-bold hover:bg-opacity-90 transition-all relative group overflow-hidden flex-1 md:flex-none"
            style={{
              clipPath: "polygon(0 0, 100% 0, 90% 100%, 10% 100%)",
            }}
          >
            <Link href="/clans/create">
              <span className="relative z-10">CREATE CLAN</span>
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
            </Link>
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
      <Tabs defaultValue="most-active" className="mb-8">
        <TabsList className="bg-black border border-[#a3ff12] p-1">
          <TabsTrigger
            value="most-active"
            className="data-[state=active]:bg-[#a3ff12] data-[state=active]:text-black"
          >
            MOST ACTIVE
          </TabsTrigger>
          <TabsTrigger value="newest" className="data-[state=active]:bg-[#a3ff12] data-[state=active]:text-black">
            NEWEST
          </TabsTrigger>
          <TabsTrigger value="top-ranked" className="data-[state=active]:bg-[#a3ff12] data-[state=active]:text-black">
            TOP RANKED
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
            {filteredClans
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
    </div>
  )
}

interface ClanCardProps {
  clan: {
    id: string
    name: string
    logo: string
    leader: string
    members: number
    wins: number
    description: string
  }
}

function ClanCard({ clan }: ClanCardProps) {
  return (
    <div className="border border-gray-800 bg-black bg-opacity-60 rounded-lg overflow-hidden hover:border-[#a3ff12] transition-all group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <Image
              src={clan.logo || "/placeholder.svg"}
              alt={clan.name}
              width={60}
              height={60}
              className="rounded-full border-2 border-[#a3ff12]"
            />
            <div className="ml-4">
              <h3 className="text-white font-bold text-lg">{clan.name}</h3>
              <p className="text-gray-400 text-sm">Led by {clan.leader}</p>
            </div>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{clan.description}</p>

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
  )
}
