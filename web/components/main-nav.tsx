"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { LensConnect } from "./LensConnect";
import { ConnectKitButton } from "connectkit";
import { useEffect, } from "react";
import { useAccount } from "wagmi";
import { evmAddress } from "@lens-protocol/client";
import { fetchAccountsBulk } from "@lens-protocol/client/actions";
import { client } from "@/lib/client";

interface MainNavProps {
  isLoaded: boolean;
}

function Profile({ profile }: { profile: any }) {
  return (
    <div>
      {profile && (
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden">
            {profile.metadata?.picture ? (
              <img
                src={profile.metadata.picture}
                alt={profile.metadata?.name || "Profile"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">
                👤
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold">
              {profile.metadata?.name || "Anonymous"}
            </h3>
            <p className="text-sm text-gray-400">
              @{profile.username?.localName || "user"}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export function MainNav({ isLoaded }: MainNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { address } = useAccount();
  const [profile, setProfile] = useState(null);

  console.log(address);

  const fetchAccountDetails = async () => {
    const result = await fetchAccountsBulk(client, {
      ownedBy: [evmAddress(address!)],
    });

    if (result.isErr()) {
      return console.error(result.error);
    }

    return result.value;
  };

  useEffect(() => {
    if (address) {
      const getAccount = async () => {
        const account = await fetchAccountDetails();
        if (account && account.length > 0) {
          setProfile(account[0] as any);
        }
      };
      getAccount();
    }
  }, [address]);

  const navItems = [
    { name: "HOME", href: "/" },
    { name: "CLANS", href: "/clans" },
    { name: "WARS", href: "/wars" },
    { name: "LEADERBOARD", href: "/leaderboard" },
    { name: "PROFILE", href: "/profile" },
  ];

  return (
    <header className="flex justify-between items-center bg-[#0B0B0F] py-4 px-10">
      <Link
        href="/"
        className={`flex items-center transform transition-all duration-1000 ${isLoaded ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
          }`}
      >
        <div className="w-6 h-6 rounded-full bg-[#39FF14] flex items-center justify-center mr-2 animate-pulse shadow-[0_0_10px_rgba(57,255,20,0.7)]">
          <div className="w-4 h-4 rounded-full border-2 border-[#0B0B0F]"></div>
        </div>
        <span className="text-[#39FF14] font-bold relative">
          CLASH OF LENS
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#39FF14] grow-underline"></span>
        </span>
      </Link>

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
        className={`hidden md:flex transform transition-all duration-1000 ${isLoaded ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"
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
            <LensConnect />
          </li>
          <li
            className="transition-all duration-500"
            style={{ transitionDelay: `${navItems.length * 100}ms` }}
          >
            <ConnectKitButton />
          </li>
          <li
            className="transition-all duration-500"
            style={{ transitionDelay: `${navItems.length * 100}ms` }}
          >
            <Profile profile={profile} />
          </li>
        </ul>
      </nav>
    </header>
  );
}
