"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { GameStats } from "@/components/game-stats";
import { ActiveWars } from "@/components/active-war";
import { TopClans } from "@/components/top-clans";
import { motion } from "framer-motion";

// SVG for sharp-edged swords
const SwordSVG = ({ className = "", style = {} }) => (
  <svg
    width="80"
    height="260"
    viewBox="0 0 80 260"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <polygon points="40,10 54,230 26,230" fill="#39FF14" stroke="#0B0B0F" strokeWidth="4" />
    <rect x="26" y="230" width="28" height="18" fill="#15151B" stroke="#39FF14" strokeWidth="3" />
    <rect x="32" y="248" width="16" height="10" fill="#FF4D00" stroke="#0B0B0F" strokeWidth="2" />
  </svg>
);

// Steps data for How to Clash
const howToClashSteps = [
  {
    color: '#39FF14',
    title: '1. Create or Join Your Clan',
    desc: 'Each clan is a Lens Group — mint a membership NFT or join via invite rules.'
  },
  {
    color: '#39FF14',
    title: '2. Declare War',
    desc: 'Clan leaders pick an opponent and challenge them for a war lasting days. A custom Lens post launches the battle.'
  },
  {
    color: '#39FF14',
    title: '3. Compete Across Real Social Metrics',
    desc: 'Earn clan points by collecting GHO tips, selling NFTs, growing followers, and posting content.'
  },
  {
    color: '#39FF14',
    title: '4. Track the Battle Live',
    desc: 'Real-time leaderboard updates powered by Lens API & subgraph. Stay on top of your clan\'s progress.'
  },
  {
    color: '#39FF14',
    title: '5. Win & Claim Rewards',
    desc: 'Victorious clans share a GHO bonus pool, exclusive Victory Emblems, and Graph Aura Badges. Top contributors earn Gold Medal NFTs.'
  },
];

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
    <div className="min-h-screen bg-[#0B0B0F] relative overflow-hidden font-sans">
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 opacity-30 pointer-events-none"
      />

      {/* Digital grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTIgMmgxdjFoLTF2LTF6bS0yLTJoMXYxaC0xdi0xem0yLTJoMXYxaC0xdi0xem0tMiAyaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bS0yIDBoMXYxaC0xdi0xem0tMiAwaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bS0yIDBoMXYxaC0xdi0xeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20 z-0"></div>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" >
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 flex flex-col items-start">
            <motion.h1
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="text-[#39FF14] font-extrabold text-5xl md:text-7xl leading-none tracking-tighter uppercase"
              style={{ letterSpacing: '-0.04em' }}
            >
              Clash of Lens
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-[#FAFAFA] text-2xl md:text-3xl mt-4 mb-6 tracking-tight"
            >
              The Ultimate SocialFi Clan War Game on Lens Protocol
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-[#B1B1B1] text-md max-w-xl mb-8"
            >
              Join clans, compete using real on-chain social metrics, and win rewards that boost your Lens reputation — all in a decentralized, transparent battlefield.<br />
              <span className="text-[#39FF14] font-bold">Social influence is your strongest weapon.</span>
            </motion.p>
            <div className="flex gap-4 mt-2">
              <Button asChild className="bg-[#39FF14] text-[#0B0B0F] font-bold border-2 border-[#39FF14] hover:bg-opacity-90 transition-all shadow-[0_0_15px_rgba(57,255,20,0.5)] px-8 py-3 uppercase text-md" style={{ borderRadius: 0 }}>
                <Link href="/clans">Join a Clan</Link>
              </Button>
              <Button asChild className="bg-[#15151B] border-2 border-[#39FF14] text-[#39FF14] font-bold hover:bg-[#39FF14] hover:bg-opacity-10 transition-all px-8 py-3 uppercase text-md" style={{ borderRadius: 0 }}>
                <Link href="/leaderboard">Leaderboard</Link>
              </Button>
              <Button asChild className="bg-[#15151B] border-2 border-[#FF4D00] text-[#FF4D00] font-bold hover:bg-[#FF4D00] hover:bg-opacity-10 transition-all px-8 py-3 uppercase text-md" style={{ borderRadius: 0 }}>
                <Link href="/wars/create">Start War</Link>
              </Button>
            </div>
          </div>
          {/* Swords Duel Animation */}
          <div className="flex-1 flex items-center justify-center relative min-h-[260px]">
            <div className="relative w-[220px] h-[360px] flex items-center justify-center" style={{ top: '-120px' }}>
              <motion.div
                className="ml-10 absolute left-1/2 top-1/2 sword-glow"
                style={{ transform: 'translate(-60%, -60%)' }}
                initial={{ rotate: -45, x: -40, y: 0 }}
                animate={{ rotate: -15, x: -20, y: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
              >
                <SwordSVG />
              </motion.div>
              <motion.div
                className="absolute left-1/2 top-1/2 sword-glow"
                style={{ transform: 'translate(-40%, -60%) scaleX(-1)' }}
                initial={{ rotate: 45, x: 40, y: 0 }}
                animate={{ rotate: 15, x: 20, y: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
              >
                <SwordSVG />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      {/* How to Clash Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b-2 border-[#00FFF7]" style={{ clipPath: 'polygon(0 2%, 100% 0, 100% 100%, 0 100%)' }}>
        <motion.h3 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-[#39FF14] text-3xl font-bold mb-8 uppercase tracking-widest">How to Clash</motion.h3>
        <HowToClashSteps />
      </section>
      {/* Why Clash Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b-2 border-[#39FF14]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 98%)' }}>
        <motion.h3 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-[#39FF14] text-3xl font-bold mb-8 uppercase tracking-widest">Why Clash of Lens?</motion.h3>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="flex items-center border-1 border-[#FF4D00] p-6 text-[#FAFAFA] text-lg" style={{ borderRadius: 0 }}>
            Earn real rewards from your social activity.
          </div>
          <div className="flex items-center border-1 border-[#FF4D00] p-6 text-[#FAFAFA] text-lg" style={{ borderRadius: 0 }}>
            Decentralized & transparent battles on Lens Protocol.
          </div>
          <div className="flex items-center border-1 border-[#FF4D00] p-6 text-[#FAFAFA] text-lg" style={{ borderRadius: 0 }}>
            Build & grow your social tribe with authentic engagement.
          </div>
          <div className="flex items-center border-1 border-[#FF4D00] p-6 text-[#FAFAFA] text-lg" style={{ borderRadius: 0 }}>
            Strategic, metric-driven PvP for serious SocialFi gamers.
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b-2 border-[#00FFF7]" style={{ clipPath: 'polygon(0 2%, 100% 0, 100% 100%, 0 100%)' }}>
        <motion.h3 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-[#00FFF7] text-3xl font-bold mb-8 uppercase tracking-widest text-center md:text-left">Ready to Join the War?</motion.h3>
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between w-full gap-8 mb-8">
          <div className="flex-1 text-[#B1B1B1] text-sm md:text-base md:text-left text-center md:max-w-lg">
            1. Sign in with your Lens account<br />
            2. Create or join a clan & register it on ClashOfLens<br />
            3. Recruit your frens and prepare for battle<br />
            4. Challenge rival clans and engage in social wars<br />
            5. Dominate leaderboards and claim rewards
          </div>
          <div className="flex flex-col md:flex-row flex-wrap gap-6 md:justify-end md:items-center w-full md:w-auto mt-8 md:mt-0">
            <Button className="bg-[#39FF14] text-[#0B0B0F] font-bold border-2 border-[#39FF14] hover:bg-opacity-90 transition-all shadow-[0_0_15px_rgba(57,255,20,0.5)] px-8 py-3 uppercase text-lg" style={{ borderRadius: 0 }}>
              Sign In with Lens
            </Button>
            <Button asChild className="bg-[#15151B] border-2 border-[#39FF14] text-[#39FF14] font-bold hover:bg-[#39FF14] hover:bg-opacity-10 transition-all px-8 py-3 uppercase text-lg" style={{ borderRadius: 0 }}>
              <Link href="/clans/create">Create Clan</Link>
            </Button>
            <Button asChild className="bg-[#15151B] border-2 border-[#00FFF7] text-[#00FFF7] font-bold hover:bg-[#00FFF7] hover:bg-opacity-10 transition-all px-8 py-3 uppercase text-lg" style={{ borderRadius: 0 }}>
              <Link href="/clans">Explore Clans</Link>
            </Button>
          </div>
        </div>
      </section>
      {/* Game Stats */}
      <GameStats isLoaded={isLoaded} />
      {/* Highlights Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid md:grid-cols-2 gap-8">
        <ActiveWars isLoaded={isLoaded} />
        <TopClans isLoaded={isLoaded} />
      </div>
      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-full h-[2px] bg-[#39FF14] opacity-10 scanline"></div>
      </div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#39FF14] via-transparent to-transparent opacity-[0.03] pointer-events-none"></div>
      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between border-t-2 border-[#39FF14] mt-16 text-[#B1B1B1] text-sm" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 98%)' }}>
        <div>Clash of Lens — Where your social moves become your power plays.</div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-[#39FF14]">Discord</a>
          <a href="#" className="hover:text-[#00FFF7]">Telegram</a>
          <a href="#" className="hover:text-[#C300FF]">FAQ</a>
        </div>
      </footer>
      <style jsx global>{`
        .sword-glow svg {
          filter: drop-shadow(0 0 16px #39FF14) drop-shadow(0 0 32px #39FF14);
        }
      `}</style>
    </div>
  );
}

function HowToClashSteps() {
  // Marquee effect: no activeStep, no arrows
  return (
    <div className="flex flex-col items-center">
      <div className="w-full overflow-x-hidden relative py-2">
        <MarqueeSteps />
      </div>
    </div>
  );
}

// MarqueeSteps component for infinite horizontal scroll
function MarqueeSteps() {
  // Duplicate steps for seamless loop
  const steps = [...howToClashSteps];
  return (
    <motion.div
      className="flex flex-row gap-6 w-max"
      animate={{ x: [0, -steps.length * 260 / 2] }}
      transition={{
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
        duration: 18,
      }}
      style={{ willChange: 'transform' }}
    >
      {steps.map((step, idx) => (
        <div
          key={idx}
          className="max-w-[260px] bg-[#15151B] border-2 p-6 shadow-xl flex flex-col items-start transition-all duration-300 snap-center"
          style={{ borderColor: step.color, borderRadius: 0 }}
        >
          <span className="font-bold text-lg mb-2" style={{ color: step.color }}>{step.title}</span>
          <p className="text-[#B1B1B1] text-md mt-2">{step.desc}</p>
        </div>
      ))}
      {/* Spacer for extra gap */}
      <div style={{ minWidth: 160, background: 'transparent' }} />
    </motion.div>
  );
}
