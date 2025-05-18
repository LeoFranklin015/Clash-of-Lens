"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Trophy, Clock, ArrowRight } from "lucide-react"

export default function WarsPage() {
  // Mock data for active wars
  const activeWars = [
    {
      id: "war-1",
      clan1: { id: "clan-1", name: "CYBER WOLVES", logo: "/placeholder.svg?height=100&width=100" },
      clan2: { id: "clan-2", name: "NEON KNIGHTS", logo: "/placeholder.svg?height=100&width=100" },
      startDate: "May 10, 2023",
      endDate: "May 17, 2023",
      timeRemaining: "2d 14h",
      score: { clan1: 1240, clan2: 1180 },
      metrics: ["Tips", "Followers", "NFT Sales", "Posts"],
    },
    {
      id: "war-2",
      clan1: { id: "clan-3", name: "PIXEL PUNKS", logo: "/placeholder.svg?height=100&width=100" },
      clan2: { id: "clan-4", name: "DEFI DEMONS", logo: "/placeholder.svg?height=100&width=100" },
      startDate: "May 8, 2023",
      endDate: "May 15, 2023",
      timeRemaining: "1d 6h",
      score: { clan1: 980, clan2: 1050 },
      metrics: ["Tips", "Followers", "NFT Sales"],
    },
    {
      id: "war-3",
      clan1: { id: "clan-5", name: "META MARINES", logo: "/placeholder.svg?height=100&width=100" },
      clan2: { id: "clan-6", name: "CHAIN CHAMPIONS", logo: "/placeholder.svg?height=100&width=100" },
      startDate: "May 12, 2023",
      endDate: "May 19, 2023",
      timeRemaining: "3d 8h",
      score: { clan1: 1560, clan2: 1420 },
      metrics: ["Tips", "Followers", "Posts"],
    },
  ]

  // Mock data for completed wars
  const completedWars = [
    {
      id: "completed-1",
      clan1: { id: "clan-1", name: "CYBER WOLVES", logo: "/placeholder.svg?height=100&width=100" },
      clan2: { id: "clan-3", name: "PIXEL PUNKS", logo: "/placeholder.svg?height=100&width=100" },
      date: "April 28, 2023",
      winner: "clan1",
      score: { clan1: 1560, clan2: 1420 },
    },
    {
      id: "completed-2",
      clan1: { id: "clan-2", name: "NEON KNIGHTS", logo: "/placeholder.svg?height=100&width=100" },
      clan2: { id: "clan-4", name: "DEFI DEMONS", logo: "/placeholder.svg?height=100&width=100" },
      date: "April 21, 2023",
      winner: "clan2",
      score: { clan1: 1240, clan2: 1380 },
    },
    {
      id: "completed-3",
      clan1: { id: "clan-5", name: "META MARINES", logo: "/placeholder.svg?height=100&width=100" },
      clan2: { id: "clan-6", name: "CHAIN CHAMPIONS", logo: "/placeholder.svg?height=100&width=100" },
      date: "April 14, 2023",
      winner: "clan1",
      score: { clan1: 1720, clan2: 1650 },
    },
  ]

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">


      {/* Page header */}
      <div className="mt-12 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-[#a3ff12] font-extrabold text-4xl md:text-5xl tracking-tighter">WAR ARENA</h1>
          <p className="text-gray-400 mt-2">
            View ongoing battles, join the fight, and contribute to your clan&apos;s victory
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
          <TabsTrigger value="active" className="cursor-pointer data-[state=active]:bg-[#a3ff12] data-[state=active]:text-black">
            ACTIVE WARS
          </TabsTrigger>
          <TabsTrigger value="completed" className="cursor-pointer data-[state=active]:bg-[#a3ff12] data-[state=active]:text-black">
            COMPLETED WARS
          </TabsTrigger>
        </TabsList>

        {/* Active Wars Tab */}
        <TabsContent value="active" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeWars.map((war) => (
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
                      {war.timeRemaining} REMAINING
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col items-center">
                      <Image
                        src={war.clan1.logo || "/placeholder.svg"}
                        alt={war.clan1.name}
                        width={60}
                        height={60}
                        className="rounded-full border-2 border-[#a3ff12]"
                      />
                      <span className="text-white text-sm mt-2">{war.clan1.name}</span>
                      <span className="text-[#a3ff12] font-bold text-xl">{war.score.clan1}</span>
                    </div>

                    <div className="text-center">
                      <div className="text-gray-500 text-lg font-bold">VS</div>
                      <div className="text-white text-xs mt-1">{war.startDate}</div>
                      <div className="text-white text-xs">to {war.endDate}</div>
                    </div>

                    <div className="flex flex-col items-center">
                      <Image
                        src={war.clan2.logo || "/placeholder.svg"}
                        alt={war.clan2.name}
                        width={60}
                        height={60}
                        className="rounded-full border-2 border-[#a3ff12]"
                      />
                      <span className="text-white text-sm mt-2">{war.clan2.name}</span>
                      <span className="text-[#a3ff12] font-bold text-xl">{war.score.clan2}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {war.metrics.map((metric, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">
                        {metric}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">
                      {war.score.clan1 > war.score.clan2
                        ? war.clan1.name + " is leading"
                        : war.score.clan2 > war.score.clan1
                          ? war.clan2.name + " is leading"
                          : "Clans are tied"}
                    </span>
                    <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-[#a3ff12] transition-colors" />
                  </div>
                </div>
                <div className="h-1 w-full bg-[#a3ff12] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </Link>
            ))}
          </div>
        </TabsContent>



        {/* Completed Wars Tab */}
        <TabsContent value="completed" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {completedWars.map((war) => (
              <div
                key={war.id}
                className="border border-gray-800 bg-black bg-opacity-60 rounded-lg overflow-hidden hover:border-[#a3ff12] transition-all group"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-bold text-lg">COMPLETED WAR</h3>
                    <div className="text-gray-400 text-sm">{war.date}</div>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <Image
                          src={war.clan1.logo || "/placeholder.svg"}
                          alt={war.clan1.name}
                          width={60}
                          height={60}
                          className={`rounded-full border-2 ${war.winner === "clan1" ? "border-[#a3ff12]" : "border-gray-700"
                            }`}
                        />
                        {war.winner === "clan1" && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#a3ff12] rounded-full flex items-center justify-center">
                            <Trophy className="h-3 w-3 text-black" />
                          </div>
                        )}
                      </div>
                      <span className="text-white text-sm mt-2">{war.clan1.name}</span>
                      <span
                        className={`font-bold text-xl ${war.winner === "clan1" ? "text-[#a3ff12]" : "text-white"}`}
                      >
                        {war.score.clan1}
                      </span>
                    </div>

                    <div className="text-center">
                      <div className="text-gray-500 text-lg font-bold">VS</div>
                      <div className="text-white text-xs mt-1">FINAL SCORE</div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <Image
                          src={war.clan2.logo || "/placeholder.svg"}
                          alt={war.clan2.name}
                          width={60}
                          height={60}
                          className={`rounded-full border-2 ${war.winner === "clan2" ? "border-[#a3ff12]" : "border-gray-700"
                            }`}
                        />
                        {war.winner === "clan2" && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#a3ff12] rounded-full flex items-center justify-center">
                            <Trophy className="h-3 w-3 text-black" />
                          </div>
                        )}
                      </div>
                      <span className="text-white text-sm mt-2">{war.clan2.name}</span>
                      <span
                        className={`font-bold text-xl ${war.winner === "clan2" ? "text-[#a3ff12]" : "text-white"}`}
                      >
                        {war.score.clan2}
                      </span>
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="text-gray-400 text-sm">
                      {war.winner === "clan1"
                        ? `${war.clan1.name} won by ${war.score.clan1 - war.score.clan2} points`
                        : `${war.clan2.name} won by ${war.score.clan2 - war.score.clan1} points`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
