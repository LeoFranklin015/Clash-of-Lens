"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Users } from "lucide-react";

interface TopClansProps {
  isLoaded: boolean;
}

export function TopClans({ isLoaded }: TopClansProps) {
  const topClans = [
    {
      id: "clan-1",
      name: "CYBER WOLVES",
      logo: "/placeholder.svg?height=100&width=100",
      members: 24,
      wins: 18,
      rank: 1,
    },
    {
      id: "clan-2",
      name: "NEON KNIGHTS",
      logo: "/placeholder.svg?height=100&width=100",
      members: 32,
      wins: 15,
      rank: 2,
    },
    {
      id: "clan-3",
      name: "PIXEL PUNKS",
      logo: "/placeholder.svg?height=100&width=100",
      members: 19,
      wins: 12,
      rank: 3,
    },
  ];

  return (
    <div
      className={`transform transition-all duration-1000 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
      style={{ transitionDelay: "1100ms" }}
    >
      <div className="bg-[#15151B]  p-6 h-full border border-[#1F1F2A]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#FAFAFA] text-xl font-bold">TOP CLANS</h2>
          <Button
            asChild
            variant="link"
            className="text-[#C300FF] p-0 h-auto font-medium"
          >
            <Link href="/clans" className="flex items-center">
              VIEW ALL
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          {topClans.map((clan) => (
            <Link
              key={clan.id}
              href={`/clans/${clan.id}`}
              className="block bg-[#1F1F2A] rounded-lg p-4 hover:border-[#39FF14] transition-all group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#39FF14] to-[#C300FF] opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Image
                      src={clan.logo || "/placeholder.svg"}
                      alt={clan.name}
                      width={50}
                      height={50}
                      className="rounded-full border-2 border-[#39FF14]"
                    />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#39FF14] rounded-full flex items-center justify-center text-[#0B0B0F] text-xs font-bold">
                      {clan.rank}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[#FAFAFA] font-bold">{clan.name}</h3>
                    <div className="flex items-center text-[#666666] text-xs mt-1">
                      <div className="flex items-center mr-3">
                        <Users className="h-3 w-3 mr-1" />
                        {clan.members}
                      </div>
                      <div className="flex items-center">
                        <Trophy className="h-3 w-3 mr-1" />
                        {clan.wins} WINS
                      </div>
                    </div>
                  </div>
                </div>

                <ArrowRight className="h-4 w-4 text-[#666666] group-hover:text-[#39FF14] transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
