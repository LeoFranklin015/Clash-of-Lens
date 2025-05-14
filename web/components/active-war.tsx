"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ActiveWarsProps {
  isLoaded: boolean;
}

export function ActiveWars({ isLoaded }: ActiveWarsProps) {
  const activeWars = [
    {
      id: "war-1",
      clan1: {
        name: "CYBER WOLVES",
        logo: "/placeholder.svg?height=100&width=100",
      },
      clan2: {
        name: "NEON KNIGHTS",
        logo: "/placeholder.svg?height=100&width=100",
      },
      timeRemaining: "2d 14h",
      score: { clan1: 1240, clan2: 1180 },
    },
    {
      id: "war-2",
      clan1: {
        name: "PIXEL PUNKS",
        logo: "/placeholder.svg?height=100&width=100",
      },
      clan2: {
        name: "DEFI DEMONS",
        logo: "/placeholder.svg?height=100&width=100",
      },
      timeRemaining: "1d 6h",
      score: { clan1: 980, clan2: 1050 },
    },
    {
      id: "war-3",
      clan1: {
        name: "META MARINES",
        logo: "/placeholder.svg?height=100&width=100",
      },
      clan2: {
        name: "CHAIN CHAMPIONS",
        logo: "/placeholder.svg?height=100&width=100",
      },
      timeRemaining: "3d 8h",
      score: { clan1: 1560, clan2: 1420 },
    },
  ];

  return (
    <div
      className={`transform transition-all duration-1000 ${
        isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
      style={{ transitionDelay: "1000ms" }}
    >
      <div className="bg-[#15151B] rounded-lg p-6 h-full border border-[#1F1F2A]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#FAFAFA] text-xl font-bold">ONGOING WARS</h2>
          <Button
            asChild
            variant="link"
            className="text-[#C300FF] p-0 h-auto font-medium"
          >
            <Link href="/wars" className="flex items-center">
              VIEW ALL
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          {activeWars.map((war) => (
            <Link
              key={war.id}
              href={`/wars/${war.id}`}
              className="block bg-[#1F1F2A] rounded-lg p-4 hover:border-[#39FF14] transition-all group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#39FF14] to-[#00FFF7] opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex flex-col items-center">
                    <Image
                      src={war.clan1.logo || "/placeholder.svg"}
                      alt={war.clan1.name}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-[#39FF14]"
                    />
                    <span className="text-[#B1B1B1] text-xs mt-1">
                      {war.clan1.name}
                    </span>
                    <span className="text-[#39FF14] font-bold">
                      {war.score.clan1}
                    </span>
                  </div>

                  <div className="text-center">
                    <div className="text-[#666666] text-xs">VS</div>
                    <div className="text-[#FAFAFA] text-xs mt-1">
                      {war.timeRemaining}
                    </div>
                    <div className="text-[#666666] text-xs">REMAINING</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <Image
                      src={war.clan2.logo || "/placeholder.svg"}
                      alt={war.clan2.name}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-[#39FF14]"
                    />
                    <span className="text-[#B1B1B1] text-xs mt-1">
                      {war.clan2.name}
                    </span>
                    <span className="text-[#39FF14] font-bold">
                      {war.score.clan2}
                    </span>
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
