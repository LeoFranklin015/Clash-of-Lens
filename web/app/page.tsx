"use client";
import { ConnectKitButton } from "connectkit";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { evmAddress } from "@lens-protocol/client";
import { fetchAccount } from "@lens-protocol/client/actions";
import { fetchAccountsBulk } from "@lens-protocol/client/actions";
import { client } from "@/lib/client";
import { LensConnect } from "@/components/LensConnect";
export default function Home() {
  const { address } = useAccount();
  const [profile, setProfile] = useState<any>(null);

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
          setProfile(account[0]);
        }
      };
      getAccount();
    }
  }, [address]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header with Profile */}
      <div className="flex justify-between items-center p-4">
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
        <ConnectKitButton />
        <LensConnect />
      </div>
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Clash of Lens
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            The ultimate blockchain-based social strategy game where your social
            influence becomes your weapon. Battle with real onchain social data
            and lead your clan to victory.
          </p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all">
            Join the Battle
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-gray-800 p-6 rounded-xl">
            <div className="text-2xl mb-4">⚔️</div>
            <h3 className="text-xl font-bold mb-2">Form or Join a Clan</h3>
            <p className="text-gray-400">
              Create your own clan or join existing ones using Lens Groups.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <div className="text-2xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">Declare War</h3>
            <p className="text-gray-400">
              Challenge other clans to epic battles that last for days.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <div className="text-2xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Fight with Graph Power</h3>
            <p className="text-gray-400">
              Compete using real metrics like tips, NFTs, followers, and
              engagement.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <div className="text-2xl mb-4">🏆</div>
            <h3 className="text-xl font-bold mb-2">Victory is Onchain</h3>
            <p className="text-gray-400">
              All battles are settled transparently on the blockchain.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">
          Your Social Weapons
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl mb-4">💸</div>
            <h3 className="text-xl font-bold mb-2">Tips Received</h3>
            <p className="text-gray-400">GHO or ERC20 tokens</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-4">🖼</div>
            <h3 className="text-xl font-bold mb-2">NFTs Collected</h3>
            <p className="text-gray-400">Via Lens posts</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-2">Followers Gained</h3>
            <p className="text-gray-400">Growing your influence</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-4">📝</div>
            <h3 className="text-xl font-bold mb-2">Posts & Engagement</h3>
            <p className="text-gray-400">Content performance</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-8">
          Ready to Lead Your Clan to Victory?
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Join the battle today and prove your social influence on the
          blockchain.
        </p>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all">
          Start Your Journey
        </button>
      </div>
    </div>
  );
}
