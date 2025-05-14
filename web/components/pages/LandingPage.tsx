"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Users, Zap } from "lucide-react";
import { GameStats } from "@/components/game-stats";
import { ActiveWars } from "@/components/active-war";
import { TopClans } from "@/components/top-clans";
import { MainNav } from "@/components/main-nav";

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animation for particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
    }[] = [];

    const createParticles = () => {
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          color: "#39FF14",
          alpha: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(57, 255, 20, ${p.alpha})`;
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;
      }

      requestAnimationFrame(animateParticles);
    };

    createParticles();
    animateParticles();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Page load animation
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0F] relative overflow-hidden">
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 opacity-30 pointer-events-none"
      />

      {/* Digital grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTIgMmgxdjFoLTF2LTF6bS0yLTJoMXYxaC0xdi0xem0yLTJoMXYxaC0xdi0xem0tMiAyaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bS0yIDBoMXYxaC0xdi0xem0tMiAwaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bS0yIDBoMXYxaC0xdi0xeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20 z-0"></div>

      {/* Content container */}
      <div className="relative z-10 max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main content */}
        <main className="grid md:grid-cols-2 gap-8 mt-12">
          <div
            className={`flex flex-col justify-center transform transition-all duration-1000 delay-300 ${
              isLoaded
                ? "translate-x-0 opacity-100"
                : "-translate-x-20 opacity-0"
            }`}
          >
            <h1 className="text-[#39FF14] font-extrabold text-5xl md:text-7xl leading-none tracking-tighter">
              <div className="overflow-hidden">
                <div
                  className="transform transition-transform duration-1000"
                  style={{ transitionDelay: "300ms" }}
                >
                  CLASH OF
                </div>
              </div>
              <div className="overflow-hidden">
                <div
                  className="transform transition-transform duration-1000"
                  style={{ transitionDelay: "500ms" }}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#39FF14] to-[#00FFF7]">
                    LENS
                  </span>
                </div>
              </div>
            </h1>

            <p
              className="text-[#B1B1B1] mt-8 text-sm leading-relaxed max-w-md transform transition-all duration-1000"
              style={{ transitionDelay: "900ms" }}
            >
              A BLOCKCHAIN-BASED SOCIAL STRATEGY GAME WHERE CLANS BATTLE USING
              REAL ONCHAIN SOCIAL DATA. YOUR INFLUENCE, ENGAGEMENT, AND EARNINGS
              ARE YOUR WEAPONS.
            </p>

            <div
              className="flex flex-wrap gap-4 mt-8 transform transition-all duration-1000"
              style={{ transitionDelay: "1000ms" }}
            >
              <Button
                asChild
                className="bg-[#39FF14] text-[#0B0B0F] font-bold hover:bg-opacity-90 transition-all relative group overflow-hidden shadow-[0_0_15px_rgba(57,255,20,0.5)]"
              >
                <Link href="/clans">
                  <span className="relative z-10 flex items-center">
                    JOIN A CLAN
                    <Users className="ml-2 h-4 w-4" />
                  </span>
                  <span className="absolute inset-0 bg-[#00FFF7] opacity-0 group-hover:opacity-20 transition-opacity"></span>
                </Link>
              </Button>

              <Button
                asChild
                className="bg-[#15151B] border border-[#39FF14] text-[#39FF14] font-bold hover:bg-[#39FF14] hover:bg-opacity-10 transition-all relative group overflow-hidden"
              >
                <Link href="/leaderboard">
                  <span className="relative z-10 flex items-center">
                    VIEW LEADERBOARD
                    <Trophy className="ml-2 h-4 w-4" />
                  </span>
                  <span className="absolute inset-0 bg-[#00FFF7] opacity-0 group-hover:opacity-10 transition-opacity"></span>
                </Link>
              </Button>

              <Button
                asChild
                className="bg-[#15151B] border border-[#FF4D00] text-[#FF4D00] font-bold hover:bg-[#FF4D00] hover:bg-opacity-10 transition-all relative group overflow-hidden"
              >
                <Link href="/wars/create">
                  <span className="relative z-10 flex items-center">
                    START WAR
                    <Zap className="ml-2 h-4 w-4" />
                  </span>
                  <span className="absolute inset-0 bg-[#FF4D00] opacity-0 group-hover:opacity-10 transition-opacity"></span>
                </Link>
              </Button>
            </div>
          </div>

          <div
            className={`relative transform transition-all duration-1000 delay-500 ${
              isLoaded
                ? "translate-x-0 opacity-100"
                : "translate-x-20 opacity-0"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            <div className="relative h-[400px] w-full overflow-hidden rounded-lg border border-[#1F1F2A] shadow-[0_0_25px_rgba(57,255,20,0.2)]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] to-transparent opacity-70 z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#00FFF7] to-[#C300FF] opacity-10"></div>
              <Image
                src="/placeholder.svg?height=800&width=600"
                alt="Clash of Lens Game"
                width={600}
                height={800}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[#FAFAFA] font-bold text-xl">
                      SEASON 1 ACTIVE
                    </h3>
                    <p className="text-[#39FF14] text-sm">15 DAYS REMAINING</p>
                  </div>
                  <Button
                    asChild
                    className="bg-[#39FF14] text-[#0B0B0F] font-bold hover:bg-opacity-90 shadow-[0_0_10px_rgba(57,255,20,0.5)]"
                  >
                    <Link href="/wars">
                      <span className="flex items-center">
                        ENTER ARENA
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 border-t border-r border-[#39FF14] opacity-30"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 border-b border-l border-[#39FF14] opacity-30"></div>
            <div className="absolute top-1/4 -right-2 w-4 h-4 bg-[#C300FF] rounded-full blur-sm"></div>
            <div className="absolute bottom-1/4 -left-2 w-4 h-4 bg-[#00FFF7] rounded-full blur-sm"></div>
          </div>
        </main>

        {/* Game Stats */}
        <GameStats isLoaded={isLoaded} />

        {/* Highlights Section */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          {/* Active Wars */}
          <ActiveWars isLoaded={isLoaded} />

          {/* Top Clans */}
          <TopClans isLoaded={isLoaded} />
        </div>
      </div>

      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-full h-[2px] bg-[#39FF14] opacity-10 scanline"></div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#39FF14] via-transparent to-transparent opacity-[0.03] pointer-events-none"></div>
    </div>
  );
}
