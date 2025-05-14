"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Zap, Calendar, ArrowRight, ArrowLeft } from "lucide-react";

export default function CreateWar() {
  const [step, setStep] = useState(1);
  const [selectedClan, setSelectedClan] = useState<string | null>(null);
  const [duration, setDuration] = useState("7");
  const [metrics, setMetrics] = useState({
    tips: true,
    followers: true,
    nftSales: true,
    posts: true,
  });

  // Mock data for clans
  const clans = [
    {
      id: "clan-2",
      name: "NEON KNIGHTS",
      logo: "/placeholder.svg?height=100&width=100",
      members: 32,
      wins: 15,
    },
    {
      id: "clan-3",
      name: "PIXEL PUNKS",
      logo: "/placeholder.svg?height=100&width=100",
      members: 19,
      wins: 12,
    },
    {
      id: "clan-4",
      name: "DEFI DEMONS",
      logo: "/placeholder.svg?height=100&width=100",
      members: 27,
      wins: 14,
    },
    {
      id: "clan-5",
      name: "META MARINES",
      logo: "/placeholder.svg?height=100&width=100",
      members: 21,
      wins: 10,
    },
    {
      id: "clan-6",
      name: "CHAIN CHAMPIONS",
      logo: "/placeholder.svg?height=100&width=100",
      members: 18,
      wins: 9,
    },
    {
      id: "clan-7",
      name: "TOKEN TITANS",
      logo: "/placeholder.svg?height=100&width=100",
      members: 15,
      wins: 7,
    },
    {
      id: "clan-8",
      name: "NFT NINJAS",
      logo: "/placeholder.svg?height=100&width=100",
      members: 22,
      wins: 11,
    },
  ];

  // Mock data for user's clan
  const userClan = {
    id: "clan-1",
    name: "CYBER WOLVES",
    logo: "/placeholder.svg?height=100&width=100",
    members: 24,
    wins: 18,
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleMetricChange = (metric: keyof typeof metrics) => {
    setMetrics({
      ...metrics,
      [metric]: !metrics[metric],
    });
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-white font-bold text-2xl">
              Step 1: Select Opposing Clan
            </h2>
            <p className="text-gray-400">
              Choose which clan you want to challenge to a war. Your clan,{" "}
              {userClan.name}, will be the challenger.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {clans.map((clan) => (
                <div
                  key={clan.id}
                  className={`border ${
                    selectedClan === clan.id
                      ? "border-[#a3ff12]"
                      : "border-gray-800"
                  } rounded-lg p-4 cursor-pointer hover:border-[#a3ff12] transition-all`}
                  onClick={() => setSelectedClan(clan.id)}
                >
                  <div className="flex items-center">
                    <Image
                      src={clan.logo || "/placeholder.svg"}
                      alt={clan.name}
                      width={50}
                      height={50}
                      className="rounded-full border-2 border-gray-700"
                    />
                    <div className="ml-4">
                      <h3 className="text-white font-bold">{clan.name}</h3>
                      <div className="flex items-center text-gray-400 text-sm mt-1">
                        <span className="mr-3">{clan.members} Members</span>
                        <span>{clan.wins} Wins</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-8">
              <Button
                onClick={handleNextStep}
                className="bg-[#a3ff12] text-black font-bold hover:bg-opacity-90"
                disabled={!selectedClan}
              >
                NEXT STEP
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-white font-bold text-2xl">
              Step 2: Set War Duration
            </h2>
            <p className="text-gray-400">
              Choose how long the war will last. This determines how much time
              each clan has to accumulate points.
            </p>

            <div className="mt-6">
              <RadioGroup
                value={duration}
                onValueChange={setDuration}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="3"
                    id="duration-3"
                    className="border-[#a3ff12] text-[#a3ff12]"
                  />
                  <Label htmlFor="duration-3" className="text-white">
                    3 Days (Quick Battle)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="7"
                    id="duration-7"
                    className="border-[#a3ff12] text-[#a3ff12]"
                  />
                  <Label htmlFor="duration-7" className="text-white">
                    7 Days (Standard War)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="14"
                    id="duration-14"
                    className="border-[#a3ff12] text-[#a3ff12]"
                  />
                  <Label htmlFor="duration-14" className="text-white">
                    14 Days (Extended Campaign)
                  </Label>
                </div>
              </RadioGroup>

              <div className="mt-6 border border-gray-800 rounded-lg p-4">
                <h3 className="text-white font-bold mb-2">War Timeline</h3>
                <div className="flex items-center text-gray-400 text-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    Start: {new Date().toLocaleDateString()} • End:{" "}
                    {new Date(
                      Date.now() +
                        Number.parseInt(duration) * 24 * 60 * 60 * 1000
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button
                onClick={handlePrevStep}
                variant="outline"
                className="border-[#a3ff12] text-[#a3ff12] hover:bg-[#a3ff12] hover:bg-opacity-10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                PREVIOUS
              </Button>
              <Button
                onClick={handleNextStep}
                className="bg-[#a3ff12] text-black font-bold hover:bg-opacity-90"
              >
                NEXT STEP
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-white font-bold text-2xl">
              Step 3: Choose Metrics
            </h2>
            <p className="text-gray-400">
              Select which on-chain social metrics will be used to determine the
              winner of the war.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="metrics-tips"
                  checked={metrics.tips}
                  onCheckedChange={() => handleMetricChange("tips")}
                  className="border-[#a3ff12] data-[state=checked]:bg-[#a3ff12] data-[state=checked]:text-black"
                />
                <Label htmlFor="metrics-tips" className="text-white">
                  Tips Received (GHO or ERC20)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="metrics-followers"
                  checked={metrics.followers}
                  onCheckedChange={() => handleMetricChange("followers")}
                  className="border-[#a3ff12] data-[state=checked]:bg-[#a3ff12] data-[state=checked]:text-black"
                />
                <Label htmlFor="metrics-followers" className="text-white">
                  Followers Gained
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="metrics-nfts"
                  checked={metrics.nftSales}
                  onCheckedChange={() => handleMetricChange("nftSales")}
                  className="border-[#a3ff12] data-[state=checked]:bg-[#a3ff12] data-[state=checked]:text-black"
                />
                <Label htmlFor="metrics-nfts" className="text-white">
                  NFTs Collected (via Lens posts)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="metrics-posts"
                  checked={metrics.posts}
                  onCheckedChange={() => handleMetricChange("posts")}
                  className="border-[#a3ff12] data-[state=checked]:bg-[#a3ff12] data-[state=checked]:text-black"
                />
                <Label htmlFor="metrics-posts" className="text-white">
                  Posts and Engagement
                </Label>
              </div>
            </div>

            <div className="mt-6 border border-gray-800 rounded-lg p-4">
              <h3 className="text-white font-bold mb-2">Metric Weights</h3>
              <p className="text-gray-400 text-sm">
                All selected metrics will be weighted equally in determining the
                final score.
              </p>
            </div>

            <div className="flex justify-between mt-8">
              <Button
                onClick={handlePrevStep}
                variant="outline"
                className="border-[#a3ff12] text-[#a3ff12] hover:bg-[#a3ff12] hover:bg-opacity-10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                PREVIOUS
              </Button>
              <Button
                onClick={handleNextStep}
                className="bg-[#a3ff12] text-black font-bold hover:bg-opacity-90"
                disabled={!Object.values(metrics).some((v) => v)}
              >
                NEXT STEP
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 4:
        const selectedClanData = clans.find((clan) => clan.id === selectedClan);

        return (
          <div className="space-y-6">
            <h2 className="text-white font-bold text-2xl">
              Step 4: Confirm & Publish
            </h2>
            <p className="text-gray-400">
              Review the war details and confirm to publish the war declaration.
            </p>

            <div className="mt-6 border border-[#a3ff12] bg-black bg-opacity-50 rounded-lg p-6">
              <h3 className="text-[#a3ff12] font-bold text-xl mb-4">
                WAR DECLARATION
              </h3>

              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col items-center">
                  <Image
                    src={userClan.logo || "/placeholder.svg"}
                    alt={userClan.name}
                    width={60}
                    height={60}
                    className="rounded-full border-2 border-[#a3ff12]"
                  />
                  <span className="text-white text-sm mt-2">
                    {userClan.name}
                  </span>
                </div>

                <div className="text-center">
                  <div className="text-gray-500 text-lg font-bold">VS</div>
                  <div className="text-white text-xs mt-1">
                    {duration} DAYS WAR
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <Image
                    src={selectedClanData?.logo || "/placeholder.svg"}
                    alt={selectedClanData?.name || ""}
                    width={60}
                    height={60}
                    className="rounded-full border-2 border-gray-700"
                  />
                  <span className="text-white text-sm mt-2">
                    {selectedClanData?.name}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border border-gray-800 rounded-lg p-3">
                  <h4 className="text-white font-bold mb-2">War Duration</h4>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {new Date().toLocaleDateString()} to{" "}
                      {new Date(
                        Date.now() +
                          Number.parseInt(duration) * 24 * 60 * 60 * 1000
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="border border-gray-800 rounded-lg p-3">
                  <h4 className="text-white font-bold mb-2">Battle Metrics</h4>
                  <div className="flex flex-wrap gap-2">
                    {metrics.tips && (
                      <span className="px-2 py-1 bg-[#a3ff12] bg-opacity-20 text-[#a3ff12] text-xs rounded-full">
                        Tips
                      </span>
                    )}
                    {metrics.followers && (
                      <span className="px-2 py-1 bg-[#a3ff12] bg-opacity-20 text-[#a3ff12] text-xs rounded-full">
                        Followers
                      </span>
                    )}
                    {metrics.nftSales && (
                      <span className="px-2 py-1 bg-[#a3ff12] bg-opacity-20 text-[#a3ff12] text-xs rounded-full">
                        NFT Sales
                      </span>
                    )}
                    {metrics.posts && (
                      <span className="px-2 py-1 bg-[#a3ff12] bg-opacity-20 text-[#a3ff12] text-xs rounded-full">
                        Posts
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button
                onClick={handlePrevStep}
                variant="outline"
                className="border-[#a3ff12] text-[#a3ff12] hover:bg-[#a3ff12] hover:bg-opacity-10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                PREVIOUS
              </Button>
              <Button
                asChild
                className="bg-[#a3ff12] text-black font-bold hover:bg-opacity-90"
              >
                <Link href="/wars">
                  <Zap className="mr-2 h-4 w-4" />
                  DECLARE WAR
                </Link>
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page header */}
      <div className="mt-12 mb-8">
        <h1 className="text-[#a3ff12] font-extrabold text-4xl md:text-5xl tracking-tighter">
          CREATE WAR
        </h1>
        <p className="text-gray-400 mt-2">
          Challenge another clan to a war and set the terms of battle
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div
              key={stepNumber}
              className="flex flex-col items-center"
              style={{ width: `${100 / 4}%` }}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  stepNumber === step
                    ? "bg-[#a3ff12] text-black"
                    : stepNumber < step
                    ? "bg-[#a3ff12] bg-opacity-20 text-[#a3ff12]"
                    : "bg-gray-800 text-white"
                }`}
              >
                {stepNumber}
              </div>
              <div
                className={`text-xs mt-2 ${
                  stepNumber === step
                    ? "text-[#a3ff12]"
                    : stepNumber < step
                    ? "text-gray-400"
                    : "text-gray-600"
                }`}
              >
                {stepNumber === 1
                  ? "SELECT CLAN"
                  : stepNumber === 2
                  ? "SET DURATION"
                  : stepNumber === 3
                  ? "CHOOSE METRICS"
                  : "CONFIRM"}
              </div>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800"></div>
          <div
            className="absolute top-0 left-0 h-1 bg-[#a3ff12]"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="border border-[#a3ff12] bg-black bg-opacity-50 rounded-lg p-6">
        {renderStepContent()}
      </div>
    </div>
  );
}
