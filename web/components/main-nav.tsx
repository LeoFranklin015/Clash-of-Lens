"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface MainNavProps {
  isLoaded: boolean;
}

export function MainNav({ isLoaded }: MainNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "HOME", href: "/" },
    { name: "CLANS", href: "/clans" },
    { name: "WARS", href: "/wars" },
    { name: "LEADERBOARD", href: "/leaderboard" },
    { name: "PROFILE", href: "/profile" },
  ];

  return (
    <header className="flex justify-between items-center bg-[#0B0B0F] py-4 px-10">
      <div
        className={`flex items-center transform transition-all duration-1000 ${
          isLoaded ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
        }`}
      >
        <div className="w-6 h-6 rounded-full bg-[#39FF14] flex items-center justify-center mr-2 animate-pulse shadow-[0_0_10px_rgba(57,255,20,0.7)]">
          <div className="w-4 h-4 rounded-full border-2 border-[#0B0B0F]"></div>
        </div>
        <span className="text-[#39FF14] font-bold relative">
          CLASH OF LENS
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#39FF14] grow-underline"></span>
        </span>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-[#39FF14]"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[#15151B] border border-[#1F1F2A] shadow-[0_0_20px_rgba(57,255,20,0.2)] z-50 p-4 md:hidden">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-2 text-[#B1B1B1] hover:text-[#39FF14] hover:bg-[#1F1F2A] transition-all rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Button
              asChild
              className="mt-4 bg-[#39FF14] text-[#0B0B0F] font-bold hover:bg-opacity-90 shadow-[0_0_10px_rgba(57,255,20,0.3)]"
            >
              <Link href="/connect">CONNECT WALLET</Link>
            </Button>
          </nav>
        </div>
      )}

      {/* Desktop navigation */}
      <nav
        className={`hidden md:flex transform transition-all duration-1000 ${
          isLoaded ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"
        }`}
      >
        <ul className="flex space-x-1">
          {navItems.map((item, index) => (
            <li
              key={item.name}
              className="transition-all duration-500"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Link
                href={item.href}
                className="px-3 py-1 text-xs text-[#B1B1B1] hover:text-[#FAFAFA] hover:bg-[#1F1F2A] transition-all relative overflow-hidden group rounded"
              >
                <span className="relative z-10">{item.name}</span>
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#39FF14] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
            </li>
          ))}
          <li
            className="transition-all duration-500"
            style={{ transitionDelay: `${navItems.length * 100}ms` }}
          >
            <Link
              href="/connect"
              className="px-3 py-1 text-xs border border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14] hover:bg-opacity-10 transition-all relative overflow-hidden group rounded"
            >
              <span className="relative z-10">CONNECT WALLET</span>
              <span className="absolute inset-0 bg-[#00FFF7] opacity-0 group-hover:opacity-10 transition-opacity"></span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
