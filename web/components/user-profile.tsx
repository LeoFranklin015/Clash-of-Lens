"use client";

import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Trophy,
  Coins,
  Zap,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { useSession } from "@/components/SessionContext";
import { evmAddress } from "@lens-protocol/client";
import { fetchGroups } from "@lens-protocol/client/actions";
import { client } from "@/lib/client";
import { useEffect } from "react";
import { contractsConfig } from "@/lib/contractsConfig";
import { Group, Clan, ClanWithGroup } from "@/lib/types";

// Mock data for the user
const user = {
  id: "user-1",
  name: "Loading...",
  avatar: "/placeholder.svg?height=200&width=200",
  banner: "/placeholder.svg?height=400&width=1200",
  wallet: "0x1a2b...3c4d",
  xpLevel: 42,
  clan: {
    id: "clan-1",
    name: "Loading...",
    logo: "/placeholder.svg?height=100&width=100",
  },
  joinDate: "Loading...",
  bio: "Loading...",
  stats: {
    warsWon: 12,
    warsLost: 3,
    contributions: 450,
    nftsCollected: 24,
  },
  socialLinks: {
    lens: "@0xCyb3r",
    farcaster: "@CyberWolf",
    twitter: "@0xCyb3r_eth",
  },
};


// Mock data for contributions
const contributions = [
  {
    id: "contrib-1",
    type: "tip",
    details: "Tipped WolfByte's post",
    amount: "0.2 ETH",
    date: "May 12, 2023",
    war: "vs NEON KNIGHTS",
  },
  {
    id: "contrib-2",
    type: "collect",
    details: "Collected Alpha Pack #007 NFT",
    amount: "0.15 ETH",
    date: "May 10, 2023",
    war: "vs NEON KNIGHTS",
  },
  {
    id: "contrib-3",
    type: "post",
    details: "Created post 'Strategy for the Final Day'",
    amount: "",
    date: "May 8, 2023",
    war: "vs NEON KNIGHTS",
  },
  {
    id: "contrib-4",
    type: "followers",
    details: "Gained 12 new followers",
    amount: "",
    date: "May 5, 2023",
    war: "vs NEON KNIGHTS",
  },
  {
    id: "contrib-5",
    type: "tip",
    details: "Tipped CryptoHowler's post",
    amount: "0.1 ETH",
    date: "April 28, 2023",
    war: "vs PIXEL PUNKS",
  },
  {
    id: "contrib-6",
    type: "collect",
    details: "Collected Digital Howl #018 NFT",
    amount: "0.08 ETH",
    date: "April 25, 2023",
    war: "vs PIXEL PUNKS",
  },
];

// Mock data for achievements
const achievements = [
  {
    id: "achievement-1",
    name: "War Champion",
    description: "Won 10+ clan wars",
    icon: "/placeholder.svg?height=50&width=50",
    date: "May 1, 2023",
  },
  {
    id: "achievement-2",
    name: "Generous Tipper",
    description: "Tipped over 1 ETH total",
    icon: "/placeholder.svg?height=50&width=50",
    date: "April 20, 2023",
  },
  {
    id: "achievement-3",
    name: "NFT Collector",
    description: "Collected 20+ NFTs",
    icon: "/placeholder.svg?height=50&width=50",
    date: "April 15, 2023",
  },
  {
    id: "achievement-4",
    name: "Social Influencer",
    description: "Gained 100+ followers",
    icon: "/placeholder.svg?height=50&width=50",
    date: "April 10, 2023",
  },
  {
    id: "achievement-5",
    name: "Content Creator",
    description: "Created 50+ posts",
    icon: "/placeholder.svg?height=50&width=50",
    date: "April 5, 2023",
  },
  {
    id: "achievement-6",
    name: "First Victory",
    description: "Won first clan war",
    icon: "/placeholder.svg?height=50&width=50",
    date: "March 22, 2023",
  },
];

// Mock data for NFTs
const nfts = [
  {
    id: "nft-1",
    name: "Cyber Wolf #042",
    image: "/placeholder.svg?height=300&width=300",
    creator: "0xCyb3r",
    collected: "May 10, 2023",
  },
  {
    id: "nft-2",
    name: "Digital Howl #018",
    image: "/placeholder.svg?height=300&width=300",
    creator: "WolfByte",
    collected: "April 25, 2023",
  },
  {
    id: "nft-3",
    name: "Alpha Pack #007",
    image: "/placeholder.svg?height=300&width=300",
    creator: "CryptoHowler",
    collected: "April 15, 2023",
  },
  {
    id: "nft-4",
    name: "Night Hunter #029",
    image: "/placeholder.svg?height=300&width=300",
    creator: "AlphaWolf",
    collected: "April 5, 2023",
  },
  {
    id: "nft-5",
    name: "War Medal #003",
    image: "/placeholder.svg?height=300&width=300",
    creator: "Clash of Lens",
    collected: "March 22, 2023",
  },
  {
    id: "nft-6",
    name: "Founder Badge",
    image: "/placeholder.svg?height=300&width=300",
    creator: "Clash of Lens",
    collected: "March 15, 2023",
  },
];


const fetchClansFromContract = async () => {
  const subgraph = contractsConfig.lensTestnet.subgraphUrl;
  const query = 
}

export default function UserProfile() {
  const { profile } = useSession();

  const fetchClans = async () => {
    if (profile?.address) {
      await fetchGroups(client, {
        filter: {
          member: evmAddress(profile.address),
        },
      }).then((result) => {
        if (result.isErr()) {
          return console.error(result.error);
        }



        console.log("Groups", result.value);

        const { items, pageInfo } = result.value;

        const clans: Clan[] = items;
      });
    }
  };
  // const fetchClans = async () => {
  //   const result = await fetchGroups(client, {
  //     filter: {
  //       member: evmAddress(address!),
  //     },
  //   });

  //   if (result.isErr()) {
  //     return console.error(result.error);
  //   }

  //   return result.value;
  // };



  useEffect(() => {
    fetchClans();
  }, [profile]);



  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* User Banner */}
      <div className="mt-12 relative rounded-lg overflow-hidden h-48 md:h-64">
        <Image
          src={
            profile?.metadata?.coverPicture || user.banner || "/placeholder.svg"
          }
          alt={`${profile?.metadata?.name || user.name} Banner`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
        <div className="absolute bottom-0 left-0 p-6 flex items-center">
          <Image
            src={
              profile?.metadata?.picture || user.avatar || "/placeholder.svg"
            }
            alt={profile?.metadata?.name || user.name}
            width={80}
            height={80}
            className="rounded-full border-4 border-[#a3ff12] shadow-[0_0_10px_#a3ff12]"
          />
          <div className="ml-4">
            <div className="flex items-center">
              <h1 className="text-white font-extrabold text-3xl md:text-4xl">
                {profile?.metadata?.name ||
                  profile?.username?.localName ||
                  user.name}
              </h1>
              <div className="ml-3 px-2 py-1 bg-[#a3ff12] text-black text-xs font-bold rounded-full">
                LVL {user.xpLevel}
              </div>
            </div>
            <div className="flex items-center mt-1">
              <span className="text-gray-300 mr-4">
                {profile?.address || user.wallet}
              </span>
              <Link
                href={`/clans/${user.clan.id}`}
                className="flex items-center text-[#a3ff12] hover:underline"
              >
                <Image
                  src={user.clan.logo || "/placeholder.svg"}
                  alt={user.clan.name}
                  width={16}
                  height={16}
                  className="rounded-full mr-1"
                />
                {user.clan.name}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-[#a3ff12] bg-black bg-opacity-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Trophy className="h-5 w-5 text-[#a3ff12] mr-2" />
            <h3 className="text-gray-400 text-xs font-medium">WARS WON</h3>
          </div>
          <p className="text-white text-2xl font-bold">{user.stats.warsWon}</p>
        </div>

        <div className="border border-[#a3ff12] bg-black bg-opacity-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Zap className="h-5 w-5 text-[#a3ff12] mr-2" />
            <h3 className="text-gray-400 text-xs font-medium">CONTRIBUTIONS</h3>
          </div>
          <p className="text-white text-2xl font-bold">
            {user.stats.contributions}
          </p>
        </div>

        <div className="border border-[#a3ff12] bg-black bg-opacity-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Shield className="h-5 w-5 text-[#a3ff12] mr-2" />
            <h3 className="text-gray-400 text-xs font-medium">WARS LOST</h3>
          </div>
          <p className="text-white text-2xl font-bold">{user.stats.warsLost}</p>
        </div>

        <div className="border border-[#a3ff12] bg-black bg-opacity-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Coins className="h-5 w-5 text-[#a3ff12] mr-2" />
            <h3 className="text-gray-400 text-xs font-medium">
              NFTS COLLECTED
            </h3>
          </div>
          <p className="text-white text-2xl font-bold">
            {user.stats.nftsCollected}
          </p>
        </div>
      </div>

      {/* User Bio */}
      <div className="mt-8 border border-[#a3ff12] bg-black bg-opacity-50 p-6 rounded-lg">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-[#a3ff12] font-bold text-xl mb-4">ABOUT</h2>
            <p className="text-gray-300">
              {profile?.metadata?.bio || user.bio}
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            {Object.entries(user.socialLinks).map(([platform, handle]) => (
              <Link
                key={platform}
                href="#"
                className="flex items-center text-gray-400 hover:text-[#a3ff12] transition-colors"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {handle}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-4 text-gray-400 text-sm">
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Joined{" "}
            {profile?.createdAt
              ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
              : user.joinDate}
          </span>
        </div>
      </div>

      {/* User Tabs */}
      <div className="mt-8">
        <Tabs defaultValue="contributions" className="w-full">
          <TabsList className="bg-black border border-[#a3ff12] p-1 w-full grid grid-cols-3">
            <TabsTrigger
              value="contributions"
              className="data-[state=active]:bg-[#a3ff12] data-[state=active]:text-black"
            >
              CONTRIBUTIONS
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="data-[state=active]:bg-[#a3ff12] data-[state=active]:text-black"
            >
              ACHIEVEMENTS
            </TabsTrigger>
            <TabsTrigger
              value="nfts"
              className="data-[state=active]:bg-[#a3ff12] data-[state=active]:text-black"
            >
              NFTS
            </TabsTrigger>
          </TabsList>

          {/* Contributions Tab */}
          <TabsContent value="contributions" className="mt-6">
            <div className="space-y-4">
              {contributions.map((contribution) => (
                <div
                  key={contribution.id}
                  className="border border-gray-800 rounded-lg p-4 hover:border-[#a3ff12] transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <span className="text-white font-bold">
                          {contribution.details}
                        </span>
                        {contribution.amount && (
                          <span className="ml-2 text-[#a3ff12] font-bold">
                            {contribution.amount}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center mt-2 text-sm text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        {contribution.date}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-400 text-sm">War</div>
                      <div className="text-white">{contribution.war}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="border border-gray-800 rounded-lg p-4 hover:border-[#a3ff12] transition-all"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-[#a3ff12] bg-opacity-20 flex items-center justify-center">
                      <Image
                        src={achievement.icon || "/placeholder.svg"}
                        alt={achievement.name}
                        width={30}
                        height={30}
                        className="rounded-full"
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-white font-bold">
                        {achievement.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 text-right text-gray-400 text-xs">
                    Earned on {achievement.date}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* NFTs Tab */}
          <TabsContent value="nfts" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nfts.map((nft) => (
                <div
                  key={nft.id}
                  className="border border-gray-800 rounded-lg overflow-hidden hover:border-[#a3ff12] transition-all group"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={nft.image || "/placeholder.svg"}
                      alt={nft.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-bold">{nft.name}</h3>
                    <div className="flex justify-between items-center mt-2 text-sm">
                      <span className="text-gray-400">By {nft.creator}</span>
                      <span className="text-gray-400">
                        Collected {nft.collected}
                      </span>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-[#a3ff12] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
