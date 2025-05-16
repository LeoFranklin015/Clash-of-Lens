"use client";

import { Shield, Zap, Trophy, Coins } from "lucide-react";

interface GameStatsProps {
  isLoaded: boolean;
}

export function GameStats({ isLoaded }: GameStatsProps) {
  const stats = [
    { name: "ACTIVE WARS", value: "24", icon: Zap, color: "#00FFF7" },
    { name: "TOTAL CLANS", value: "156", icon: Shield, color: "#39FF14" },
    { name: "NFTS COLLECTED", value: "2.4K", icon: Coins, color: "#C300FF" },
    { name: "BATTLES WON", value: "1.2K", icon: Trophy, color: "#FF4D00" },
  ];

  return (
    <div
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  mt-16 transform transition-all duration-1000 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
      style={{ transitionDelay: "800ms" }}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={stat.name}
            className="bg-zinc-900 p-4 relative overflow-hidden group transition-all hover:shadow-[0_0_15px_rgba(57,255,20,0.2)]"
            style={{ transitionDelay: `${800 + index * 100}ms` }}
          >
            <div
              className="absolute top-0 right-0 w-16 h-16 -mt-8 -mr-8 rounded-full"
              style={{ backgroundColor: `${stat.color}20` }}
            ></div>
            <div className="flex items-center mb-2">
              <stat.icon
                className="h-5 w-5 mr-2"
                style={{ color: stat.color }}
              />
              <h3 className="text-[#666666] text-xs font-medium">
                {stat.name}
              </h3>
            </div>
            <p className="text-[#FAFAFA] text-2xl font-bold">{stat.value}</p>
            <div
              className="absolute bottom-0 left-0 w-full h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
              style={{ backgroundColor: stat.color }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}
