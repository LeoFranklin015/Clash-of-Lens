"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { client } from "@/lib/client";
import { useSession } from "@/components/SessionContext";
import { useEthersSigner } from "@/lib/walletClientToSigner";
import { signMessageWith } from "@lens-protocol/client/ethers";

import { ConnectButton } from "@/components/connectButton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface MainNavProps {
  isLoaded: boolean;
}

export function MainNav({ isLoaded }: MainNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { address } = useAccount();
  const { setSessionClient, sessionClient, clearSession, profile } =
    useSession();
  const signer = useEthersSigner();

  useEffect(() => {
    if (address && signer && profile) {
      const authenticate = async () => {
        const authenticated = await client.login({
          accountOwner: {
            app: "0xC75A89145d765c396fd75CbD16380Eb184Bd2ca7",
            owner: signer.address,
            account: profile.address,
          },
          signMessage: signMessageWith(signer),
        });

        if (authenticated.isErr()) {
          return console.error(authenticated.error);
        }

        // SessionClient: { ... }
        const sessionClient = authenticated.value;
        setSessionClient(sessionClient);
      };
      if (address && signer && sessionClient === null) {
        authenticate();
      }
    }
  }, [address, signer, setSessionClient]);

  const navItems = [
    { name: "HOME", href: "/" },
    { name: "CLANS", href: "/clans" },
    { name: "WARS", href: "/wars" },
    { name: "LEADERBOARD", href: "/leaderboard" },
    { name: "PROFILE", href: "/profile" },
    { name: "MARKETS", href: "/markets" },
  ];

  return (
    <header className="flex justify-between items-center bg-[#0B0B0F] py-4 px-10">
      <Link
        href="/"
        className={`flex items-center transform transition-all duration-1000 ${
          isLoaded ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
        }`}
      >
        <Image
          src="/logo.png"
          alt="Clash of Lens Logo"
          width={60}
          height={60}
          className="mr-2"
        />
        <span className="text-[#a3ff12] font-bold relative">
          CLASH OF LENS
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#a3ff12] grow-underline"></span>
        </span>
        <span className="flex items-center ml-4 space-x-2 text-xs text-[#B1B1B1] font-normal">
          powered by
          <span className="ml-2 inline-block align-middle">
            <svg
              width="80"
              height="20"
              viewBox="0 0 80 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                mask="url(#lens-logo-mask)"
                width="80"
                height="20"
                fill="#fff"
              ></rect>
              <defs>
                <mask id="lens-logo-mask">
                  <g fill="white">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M21.1625 5.66312C22.1496 4.74966 23.4447 4.18348 24.8881 4.18298C28.0955 4.18405 30.6939 6.78463 30.6939 9.9942C30.6939 12.7709 27.9461 15.1454 27.2592 15.6922C24.0469 18.2502 19.8628 19.746 15.3469 19.746C10.8311 19.746 6.64696 18.2502 3.43472 15.6922C2.75168 15.1454 0 12.767 0 9.9942C0 6.78397 2.59946 4.18298 5.80389 4.18298C7.24803 4.18298 8.54386 4.74926 9.53134 5.66312L9.63282 5.61235C9.8592 2.61691 12.2947 0.25415 15.3469 0.25415C18.3992 0.25415 20.8347 2.61691 21.0611 5.61235L21.1625 5.66312ZM22.3218 11.4404C22.7628 11.8817 23.079 12.4128 23.2546 12.9947H23.2585C23.3405 13.2603 23.157 13.5376 22.8838 13.5844C22.6535 13.6235 22.4311 13.479 22.3608 13.2525C22.2281 12.8229 21.9939 12.4284 21.666 12.1004C21.1352 11.5693 20.4288 11.2763 19.6755 11.2763C19.6462 11.2763 19.6179 11.2783 19.5896 11.2803C19.5613 11.2822 19.533 11.2842 19.5037 11.2842C19.9253 11.4794 20.2219 11.9051 20.2219 12.4011C20.2219 13.0845 19.6716 13.6352 18.9885 13.6352C18.3055 13.6352 17.7552 13.0806 17.7552 12.4011C17.7552 12.2449 17.7864 12.0926 17.841 11.9559C17.7864 12.0028 17.7317 12.0496 17.681 12.1004C17.3531 12.4284 17.119 12.8229 16.9862 13.2525C16.9199 13.479 16.6974 13.6235 16.4632 13.5844C16.19 13.5376 16.0066 13.2603 16.0885 12.9947C16.2642 12.4128 16.5803 11.8817 17.0214 11.4404C17.7278 10.7335 18.6724 10.343 19.6716 10.343C20.6708 10.343 21.6153 10.7335 22.3218 11.4404ZM10.9405 11.2803L10.9405 11.2803L10.9405 11.2803C10.9688 11.2784 10.9971 11.2764 11.0264 11.2764C11.7797 11.2764 12.4861 11.5693 13.0169 12.1005C13.3448 12.4285 13.579 12.823 13.7117 13.2526C13.7819 13.4791 14.0044 13.6236 14.2347 13.5845C14.5079 13.5377 14.6914 13.2604 14.6094 12.9948C14.4338 12.4129 14.1176 11.8818 13.6766 11.4405C12.9701 10.7336 12.0256 10.3431 11.0264 10.3431C10.0272 10.3431 9.08263 10.7336 8.37617 11.4405C7.93512 11.8818 7.61897 12.4129 7.44333 12.9948C7.36136 13.2604 7.54481 13.5377 7.81803 13.5845C8.05221 13.6236 8.27469 13.4791 8.34104 13.2526C8.47374 12.823 8.70793 12.4285 9.03579 12.1005C9.08653 12.0497 9.14117 12.0028 9.19582 11.956C9.14117 12.0927 9.10995 12.245 9.10995 12.4012C9.10995 13.0807 9.66028 13.6353 10.3433 13.6353C11.0264 13.6353 11.5767 13.0846 11.5767 12.4012C11.5767 11.9052 11.2801 11.4795 10.8585 11.2843H10.8546C10.8839 11.2843 10.9122 11.2823 10.9405 11.2803ZM15.3512 15.7909C16.0694 15.7909 16.7251 15.5176 17.2247 15.0723C17.4082 14.9122 17.6775 14.9044 17.857 15.0645C18.06 15.2442 18.0717 15.5683 17.8687 15.7519C17.2052 16.3572 16.3192 16.7282 15.3512 16.7282C14.3833 16.7282 13.5012 16.3572 12.8337 15.7519C12.6308 15.5683 12.6425 15.2481 12.8454 15.0645C13.0289 14.9005 13.2982 14.9122 13.4777 15.0723C13.9734 15.5176 14.6331 15.7909 15.3512 15.7909Z"
                    ></path>
                    <path d="M74.5344 16.914C77.716 16.914 80.0002 15.6087 80.0002 12.9982C80.0002 11.1219 78.8157 9.80032 76.2476 8.83769L75.5949 8.59295C74.5703 8.20872 73.9633 7.85874 73.9633 7.20611C73.9633 5.73769 77.2265 6.30874 78.9397 6.71664L79.837 3.94295C78.7765 3.61664 77.6344 3.3719 76.0028 3.3719C72.7397 3.3719 70.6186 5.00348 70.6186 7.28769C70.6186 9.00085 71.8292 10.0907 73.4739 10.7956L74.616 11.2851C76.0934 11.9181 76.8186 12.1824 76.8186 12.8351C76.8186 13.4061 76.0028 13.8956 74.616 13.8956C73.5555 13.8956 72.4133 13.7324 71.1897 13.4877L70.7818 16.4245C71.6791 16.6693 72.9028 16.914 74.5344 16.914ZM58.7081 16.7509H61.9712V8.91927C61.9712 7.20611 62.8686 6.22716 64.337 6.22716C65.8054 6.22716 66.6212 7.28769 66.6212 9.00085V16.7509H69.8844V8.75611C69.8844 5.49295 68.0897 3.20874 64.337 3.20874C60.9923 3.20874 58.7081 5.49295 58.7081 8.75611V16.7509ZM44.3502 16.914C45.4923 16.914 46.3897 16.7509 47.2054 16.4245L46.8791 13.4061C44.5949 13.8956 41.9028 13.9772 41.9028 11.2851V3.77979H38.6396V11.6114C38.6396 15.1193 40.6791 16.914 44.3502 16.914ZM46.716 9.9798C46.716 15.2604 50.4621 16.9817 53.8182 16.9817C55.1488 16.9817 56.5258 16.7109 57.548 16.2842L57.1475 13.4012C56.069 13.7104 54.9457 13.8156 53.9218 13.8156C51.8318 13.8156 49.9065 13.1222 49.9065 10.2825V9.73506C49.9065 7.49572 51.0135 6.31037 52.6541 6.31037C53.7309 6.31037 54.6299 6.93037 54.6299 8.10348C54.6299 9.52866 52.7365 10.1748 49.3273 10.0614L49.4905 11.9377C53.7758 13.1565 57.8115 11.8422 57.8115 8.0219C57.8115 5.32816 55.7525 3.45021 52.7773 3.45021C49.1976 3.45021 46.7168 6.00364 46.7168 9.9798H46.716Z"></path>
                  </g>
                </mask>
              </defs>
            </svg>
          </span>
        </span>
      </Link>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-[#a3ff12]"
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
                className="px-3 py-2 text-[#B1B1B1] hover:text-[#a3ff12] hover:bg-[#1F1F2A] transition-all rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Button
              asChild
              className="mt-4 bg-[#a3ff12] text-[#0B0B0F] font-bold hover:bg-opacity-90 shadow-[0_0_10px_rgba(57,255,20,0.3)]"
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
        <ul className="flex items-center space-x-1">
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
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#a3ff12] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
            </li>
          ))}
          <li
            className="transition-all duration-500"
            style={{ transitionDelay: `${navItems.length * 100}ms` }}
          >
            <ConnectButton />
          </li>
          <li
            className="transition-all duration-500"
            style={{ transitionDelay: `${navItems.length * 100}ms` }}
          >
            {profile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="cursor-pointer focus:outline-none">
                    <div className="w-10 h-10 shadow-[#a3ff12] shadow-lg bg-gray-700 overflow-hidden rounded-full border-2 border-[#a3ff12] flex items-center justify-center">
                      {profile.metadata?.picture ? (
                        <Avatar>
                          <AvatarImage
                            src={profile.metadata.picture}
                            alt={profile.metadata?.name || "Profile"}
                            className="w-full h-full object-cover rounded-md"
                          />
                          <AvatarFallback>
                            {profile.metadata?.name?.[0] ||
                              profile.username?.localName?.[0] ||
                              "👤"}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar>
                          <AvatarFallback>
                            {profile.metadata?.name?.[0] ||
                              profile.username?.localName?.[0] ||
                              "👤"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-zinc-900 w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col items-start">
                      <span className="font-bold text-white text-base">
                        {profile.metadata?.name ||
                          profile.username?.localName ||
                          "Anonymous"}
                      </span>
                      <span className="text-xs text-white break-all">
                        @{profile.username?.localName || "user"}
                      </span>
                      <span className="text-xs text-white break-all mt-1">
                        {profile.address}
                      </span>
                      <span className="text-xs text-white break-all mt-1">
                        {profile.metadata?.bio}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onClick={() => {
                      clearSession();
                      window.location.reload();
                    }}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
