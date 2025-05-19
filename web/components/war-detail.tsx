"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Coins, Heart, MessageSquare, Share2, Send } from "lucide-react";
import { fetchWarStats } from "@/lib/subgraphHandlers/fetchWarStats";
import { fetchWarClans } from "@/lib/subgraphHandlers/fetchWarClans";
import { fetchGroup } from "@lens-protocol/client/actions";
import { client } from "@/lib/client";
import { storageClient } from "@/lib/storage-client";
import { useSession } from "./SessionContext";
import {
  textOnly,
  image as imageMetadata,
  MediaImageMimeType,
  MetadataLicenseType,
} from "@lens-protocol/metadata";
import { evmAddress } from "@lens-protocol/client";
import { post, fetchPosts } from "@lens-protocol/client/actions";
import { uploadImage } from "@/lib/uploadImage";
import { useAccount } from "wagmi";

// Mock data for contribution feed
const contributionFeed = [
  {
    id: "contrib-1",
    user: {
      name: "0xCyb3r",
      avatar: "/placeholder.svg?height=50&width=50",
      clan: "clan1",
    },
    action: "tipped",
    target: "WolfByte's post",
    amount: "0.05 ETH",
    time: "2 hours ago",
  },
  {
    id: "contrib-2",
    user: {
      name: "NeonRider",
      avatar: "/placeholder.svg?height=50&width=50",
      clan: "clan2",
    },
    action: "collected",
    target: "Digital Warrior NFT",
    amount: "",
    time: "3 hours ago",
  },
  {
    id: "contrib-3",
    user: {
      name: "CryptoHowler",
      avatar: "/placeholder.svg?height=50&width=50",
      clan: "clan1",
    },
    action: "posted",
    target: "Strategy Update",
    amount: "",
    time: "4 hours ago",
  },
  {
    id: "contrib-4",
    user: {
      name: "LightKnight",
      avatar: "/placeholder.svg?height=50&width=50",
      clan: "clan2",
    },
    action: "gained",
    target: "5 new followers",
    amount: "",
    time: "5 hours ago",
  },
  {
    id: "contrib-5",
    user: {
      name: "AlphaWolf",
      avatar: "/placeholder.svg?height=50&width=50",
      clan: "clan1",
    },
    action: "tipped",
    target: "0xCyb3r's post",
    amount: "0.1 ETH",
    time: "6 hours ago",
  },
  {
    id: "contrib-6",
    user: {
      name: "NeonQueen",
      avatar: "/placeholder.svg?height=50&width=50",
      clan: "clan2",
    },
    action: "posted",
    target: "Rally Call",
    amount: "",
    time: "7 hours ago",
  },
];

interface WarDetailProps {
  warId: string;
}

interface ImageMetadata {
  mainContentFocus: "IMAGE";
  title?: string;
  content?: string;
  image: {
    item: string;
    altTag?: string;
    width?: number;
    height?: number;
  };
}

interface TextOnlyMetadata {
  mainContentFocus: "TEXT_ONLY";
  content: string;
}

type PostMetadata = ImageMetadata | TextOnlyMetadata;

interface Post {
  id: string;
  author: {
    username: {
      value: string;
    };
    metadata: {
      picture: string | null;
    };
  };
  timestamp: string;
  metadata: PostMetadata;
  stats: {
    upvotes: number;
    comments: number;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions: any[];
}

export default function WarDetail({ warId }: WarDetailProps) {
  const [message, setMessage] = useState("");
  const [postType, setPostType] = useState<"collect" | "tip" | null>(null);
  const { userClan, sessionClient } = useSession();
  const { address } = useAccount();
  const contributionFeedRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [warStats, setWarStats] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [warData, setWarData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [clanDetails, setClanDetails] = useState<Record<string, any>>({});
  const [posts, setPosts] = useState<Post[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [clanAddress, setClanAddress] = useState<string[]>([]);

  // Auto scroll to bottom of contribution feed
  useEffect(() => {
    if (contributionFeedRef.current) {
      contributionFeedRef.current.scrollTop =
        contributionFeedRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    const handleFetchPosts = async (
      clan1Address: string,
      clan2Address: string
    ) => {
      const result = await fetchPosts(client, {
        filter: {
          feeds: [
            // {
            //   globalFeed: true,
            // },
            // filter by a specific feed address
            {
              feed: evmAddress(clan1Address),
            },
          ],
        },
      });

      console.log("Result", result);
      if (result.isErr()) {
        return console.error(result.error);
      }

      // items: Array<AnyPost>
      const { items } = result.value;
      console.log("Posts", items);
      setPosts(items as unknown as Post[]);
    };

    if (clanAddress.length > 1) {
      handleFetchPosts(clanAddress[0], clanAddress[1]);
    }
  }, [clanAddress]);

  const fetchClanDetails = async (clanAddress: string) => {
    try {
      const result = await fetchGroup(client, {
        group: evmAddress(clanAddress),
      });
      console.log("Clan details", result);
      if (result.isOk()) {
        setClanDetails((prev) => ({
          ...prev,
          [clanAddress.toLowerCase()]: result.value,
        }));

        setClanAddress((prev) => [...prev, result.value?.feed?.address]);
      }
    } catch (e) {
      console.error("Error fetching clan details:", e);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const [statsData, warClansData] = await Promise.all([
        fetchWarStats(warId),
        fetchWarClans(37111, warId),
      ]);
      setWarStats(statsData);
      setWarData(warClansData);

      // Fetch details for both clans
      if (warClansData?.clan1?.id) {
        await fetchClanDetails(warClansData.clan1.id);
      }
      if (warClansData?.clan2?.id) {
        await fetchClanDetails(warClansData.clan2.id);
      }
    };
    fetchData();
  }, [warId]);

  // Calculate total scores
  const clan1Score = warStats
    ? warStats.clan1.tips +
      warStats.clan1.collects +
      warStats.clan1.comments +
      warStats.clan1.quotes +
      warStats.clan1.upvotes +
      warStats.clan1.bookmarks
    : 0;
  const clan2Score = warStats
    ? warStats.clan2.tips +
      warStats.clan2.collects +
      warStats.clan2.comments +
      warStats.clan2.quotes +
      warStats.clan2.upvotes +
      warStats.clan2.bookmarks
    : 0;

  // Get clan details
  const clan1Details = warData?.clan1?.id
    ? clanDetails[warData.clan1.id.toLowerCase()]
    : null;

  const clan2Details = warData?.clan2?.id
    ? clanDetails[warData.clan2.id.toLowerCase()]
    : null;

  // Mock data for the war
  const war = {
    id: warId,
    clan1: {
      id: warData?.clan1?.id || "clan-1",
      name: clan1Details?.metadata?.name || "CYBER WOLVES",
      logo: clan1Details?.metadata?.icon
        ? storageClient.resolve(clan1Details.metadata.icon)
        : "/placeholder.svg?height=100&width=100",
    },
    clan2: {
      id: warData?.clan2?.id || "clan-2",
      name: clan2Details?.metadata?.name || "NEON KNIGHTS",
      logo: clan2Details?.metadata?.icon
        ? storageClient.resolve(clan2Details.metadata.icon)
        : "/placeholder.svg?height=100&width=100",
    },
    startDate: "May 10, 2023",
    endDate: "May 17, 2023",
    timeRemaining: "2d 14h",
    score: {
      clan1: clan1Score,
      clan2: clan2Score,
    },
    metrics: [
      {
        name: "Tips",
        clan1: warStats?.clan1.tips || 0,
        clan2: warStats?.clan2.tips || 0,
      },
      {
        name: "Collects",
        clan1: warStats?.clan1.collects || 0,
        clan2: warStats?.clan2.collects || 0,
      },
      {
        name: "Comments",
        clan1: warStats?.clan1.comments || 0,
        clan2: warStats?.clan2.comments || 0,
      },
      {
        name: "Quotes",
        clan1: warStats?.clan1.quotes || 0,
        clan2: warStats?.clan2.quotes || 0,
      },
      {
        name: "Upvotes",
        clan1: warStats?.clan1.upvotes || 0,
        clan2: warStats?.clan2.upvotes || 0,
      },
      {
        name: "Bookmarks",
        clan1: warStats?.clan1.bookmarks || 0,
        clan2: warStats?.clan2.bookmarks || 0,
      },
    ],
  };

  // Update the handleImageUpload function with more logging
  const handleImageUpload = async (file: File) => {
    try {
      if (!address) {
        console.error("No user address available");
        throw new Error("No user address available");
      }
      console.log("Starting image upload with address:", address);
      const imageUrl = await uploadImage(file, address);
      console.log("Image uploaded successfully:", imageUrl);
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handlePost = async () => {
    if (sessionClient) {
      try {
        let postMetadata;
        if (imageFile) {
          console.log("Processing image file:", imageFile.name);
          // Upload image and get URL
          const imageUrl = await handleImageUpload(imageFile);
          console.log("Image URL received:", imageUrl);

          // Detect mime type
          let mimeType = MediaImageMimeType.PNG;
          if (imageFile.type === "image/jpeg")
            mimeType = MediaImageMimeType.JPEG;
          else if (imageFile.type === "image/gif")
            mimeType = MediaImageMimeType.GIF;
          else if (imageFile.type === "image/webp")
            mimeType = MediaImageMimeType.WEBP;

          console.log("Creating image metadata with mime type:", mimeType);
          // Create image metadata
          postMetadata = imageMetadata({
            title: message || "Image post",
            image: {
              item: imageUrl,
              type: mimeType,
              altTag: "User uploaded image",
              license: MetadataLicenseType.CCO,
            },
          });
        } else {
          console.log("Creating text-only metadata");
          // Create text-only metadata if no image
          postMetadata = textOnly({
            content: message,
          });
        }

        console.log("Uploading metadata to storage");
        // Upload metadata and create post
        const { uri: contentUri } = await storageClient.uploadAsJson(
          postMetadata
        );
        console.log("Metadata uploaded, creating post with URI:", contentUri);

        await post(sessionClient, {
          contentUri,
          feed: evmAddress(userClan?.feedAddress || ""),
        });
        console.log("Post created successfully");

        // Reset state
        setMessage("");
        setImageFile(null);
        setImagePreview("");
      } catch (error) {
        console.error("Error creating post:", error);
        alert("Failed to create post. Please try again.");
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Scoreboard */}
      <div className="lg:col-span-1">
        <div className="border border-[#a3ff12] bg-black bg-opacity-50 rounded-lg p-6">
          <h2 className="text-white font-bold text-xl mb-6 text-center">
            SCOREBOARD
          </h2>

          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col items-center">
              <Link href={`/clans/${war.clan1.id}`}>
                <Image
                  src={war.clan1.logo || "/placeholder.svg"}
                  alt={war.clan1.name}
                  width={80}
                  height={80}
                  className={`rounded-full w-20 h-20 object-cover bg-white border-4 ${
                    clan1Score >= clan2Score
                      ? "border-[#a3ff12] shadow-[0_0_10px_#a3ff12]"
                      : "border-gray-700"
                  }`}
                />
              </Link>
              <h3 className="text-white font-bold mt-2">{war.clan1.name}</h3>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold">
                <span
                  className={
                    clan1Score >= clan2Score ? "text-[#a3ff12]" : "text-white"
                  }
                >
                  {war.score.clan1}
                </span>
                <span className="text-gray-500 mx-2">:</span>
                <span
                  className={
                    clan2Score >= clan1Score ? "text-[#a3ff12]" : "text-white"
                  }
                >
                  {war.score.clan2}
                </span>
              </div>
              <div className="text-gray-400 text-sm mt-1">TOTAL SCORE</div>
            </div>

            <div className="flex flex-col items-center">
              <Link href={`/clans/${war.clan2.id}`}>
                <Image
                  src={war.clan2.logo || "/placeholder.svg"}
                  alt={war.clan2.name}
                  width={80}
                  height={80}
                  className={`rounded-full border-4 ${
                    clan2Score >= clan1Score
                      ? "border-[#a3ff12] shadow-[0_0_10px_#a3ff12]"
                      : "border-gray-700"
                  }`}
                />
              </Link>
              <h3 className="text-white font-bold mt-2">{war.clan2.name}</h3>
            </div>
          </div>

          <div className="space-y-4">
            {war.metrics.map((metric, index) => {
              const total = metric.clan1 + metric.clan2;
              const leftWidth = total === 0 ? 50 : (metric.clan1 / total) * 100;
              const rightWidth =
                total === 0 ? 50 : (metric.clan2 / total) * 100;

              return (
                <div
                  key={index}
                  className="border border-gray-800 rounded-lg p-3"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">{metric.name}</span>
                    <div className="flex items-center">
                      <span className="text-[#a3ff12] font-bold">
                        {metric.clan1}
                      </span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-white font-bold">
                        {metric.clan2}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-[#a3ff12] h-full"
                      style={{ width: `${leftWidth}%` }}
                    ></div>
                    <div
                      className="bg-gray-400 h-full"
                      style={{ width: `${rightWidth}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contribution Feed */}
        <div className="mt-8 border border-[#a3ff12] bg-black bg-opacity-50 rounded-lg p-6">
          <h2 className="text-white font-bold text-xl mb-4">
            CONTRIBUTION FEED
          </h2>

          <div
            ref={contributionFeedRef}
            className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar"
          >
            {contributionFeed.map((contribution) => (
              <div
                key={contribution.id}
                className={`border ${
                  contribution.user.clan === "clan1"
                    ? "border-[#a3ff12] bg-[#a3ff12] bg-opacity-5"
                    : "border-gray-700 bg-gray-800 bg-opacity-20"
                } rounded-lg p-3 flex items-start`}
              >
                <Image
                  src={contribution.user.avatar || "/placeholder.svg"}
                  alt={contribution.user.name}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
                <div className="ml-3">
                  <div className="flex items-center">
                    <span
                      className={`font-bold ${
                        contribution.user.clan === "clan1"
                          ? "text-[#a3ff12]"
                          : "text-white"
                      }`}
                    >
                      {contribution.user.name}
                    </span>
                    <span className="text-gray-400 text-xs ml-2">
                      {contribution.time}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    {contribution.action} {contribution.target}{" "}
                    {contribution.amount && (
                      <span className="text-[#a3ff12]">
                        {contribution.amount}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Action Panel & Posts */}
      <div className="lg:col-span-2">
        <div className="border border-[#a3ff12] bg-black bg-opacity-50 rounded-lg p-6">
          <h2 className="text-white font-bold text-xl mb-4">ACTION PANEL</h2>

          <Tabs defaultValue="post" className="w-full">
            <TabsList className="bg-black border border-[#a3ff12] p-1 w-full grid grid-cols-3">
              <TabsTrigger
                value="post"
                className="data-[state=active]:bg-[#a3ff12] data-[state=active]:text-black"
              >
                CREATE POST
              </TabsTrigger>
            </TabsList>

            <TabsContent value="post" className="mt-4">
              <div className="space-y-4">
                <Textarea
                  placeholder="What's on your mind? Create a post to help your clan..."
                  className="bg-black text-white border-gray-700 focus:border-[#a3ff12] min-h-[120px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-2">
                    <label className="relative cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            console.log(
                              "File selected:",
                              file.name,
                              file.type,
                              file.size
                            );
                            setImageFile(file);
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                      <div className="flex items-center space-x-2 px-4 py-2 border border-gray-700 rounded-md hover:bg-gray-800 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-5 h-5 text-gray-400"
                        >
                          <path
                            fillRule="evenodd"
                            d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm text-gray-400">
                          Upload Image
                        </span>
                      </div>
                    </label>
                    {imagePreview && (
                      <div className="relative">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          width={40}
                          height={40}
                          className="rounded-md object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview("");
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <RadioGroup
                      value={postType || ""}
                      onValueChange={(value) =>
                        setPostType(value as "collect" | "tip" | null)
                      }
                      className="flex items-center space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="collect"
                          id="collect"
                          className="border-[#a3ff12] text-[#a3ff12] focus:ring-[#a3ff12]"
                        />
                        <Label
                          htmlFor="collect"
                          className="text-sm text-gray-400 cursor-pointer"
                        >
                          CollectNFT
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="tip"
                          id="tip"
                          className="border-[#a3ff12] text-[#a3ff12] focus:ring-[#a3ff12]"
                        />
                        <Label
                          htmlFor="tip"
                          className="text-sm text-gray-400 cursor-pointer"
                        >
                          Tip
                        </Label>
                      </div>
                    </RadioGroup>
                    <Button
                      onClick={handlePost}
                      className="cursor-pointer bg-[#a3ff12] text-black font-bold hover:bg-opacity-90"
                      disabled={!message.trim() && !imageFile}
                    >
                      POST
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Winner Announcement */}
        {warData?.result > 0 && (
          <div className="mt-8 mb-4 p-6 border border-[#a3ff12] bg-black bg-opacity-50 rounded-lg text-center">
            <h2 className="text-2xl font-bold text-[#a3ff12] mb-2">
              WAR ENDED
            </h2>
            <p className="text-xl text-white">
              {warData.result === 1 ? war.clan1.name : war.clan2.name} has won
              the war!
            </p>
            <p className="text-gray-400 mt-2">
              Final Score: {war.score.clan1} - {war.score.clan2}
            </p>
          </div>
        )}

        {/* Clan Posts */}
        <div className="mt-8 border border-[#a3ff12] bg-black bg-opacity-50 rounded-lg p-6">
          <h2 className="text-white font-bold text-xl mb-4">CLAN POSTS</h2>

          <pre className="space-y-6 text-white">
            {posts.map((post) => (
              <div
                key={post.id}
                className="border border-gray-800 rounded-lg overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-center">
                    <Image
                      src={post.author.metadata.picture || "/placeholder.svg"}
                      alt={post.author.username.value}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-[#a3ff12]"
                    />
                    <div className="ml-3">
                      <div className="text-white font-bold">
                        {post.author.username.value}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {new Date(post.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {post.metadata.mainContentFocus === "TEXT_ONLY" ? (
                    <p className="text-gray-300 mt-3">
                      {post.metadata.content}
                    </p>
                  ) : post.metadata.mainContentFocus === "IMAGE" &&
                    post.metadata.image ? (
                    <div className="mt-3">
                      {post.metadata.title && (
                        <h3 className="text-white font-semibold mb-2">
                          {post.metadata.title}
                        </h3>
                      )}
                      <div className="rounded-lg overflow-hidden">
                        <Image
                          src={post.metadata.image.item}
                          alt={post.metadata.image.altTag || "Post image"}
                          width={post.metadata.image.width || 500}
                          height={post.metadata.image.height || 300}
                          className="w-full object-cover"
                        />
                      </div>
                      {post.metadata.content && (
                        <p className="text-gray-300 mt-2">
                          {post.metadata.content}
                        </p>
                      )}
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center text-gray-400 hover:text-[#a3ff12] transition-colors">
                        <Heart className="h-5 w-5 mr-1" />
                        <span>{post.stats.upvotes}</span>
                      </button>
                      <button className="flex items-center text-gray-400 hover:text-[#a3ff12] transition-colors">
                        <MessageSquare className="h-5 w-5 mr-1" />
                        <span>{post.stats.comments}</span>
                      </button>
                      <button className="flex items-center text-gray-400 hover:text-[#a3ff12] transition-colors">
                        <Share2 className="h-5 w-5 mr-1" />
                      </button>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-black cursor-pointer hover:text-white border-[#a3ff12] text-[#a3ff12] hover:bg-[#a3ff12] hover:bg-opacity-10"
                        disabled={!post.actions || post.actions.length === 0}
                      >
                        <Coins className="h-4 w-4 mr-1" />
                        TIP
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#a3ff12] cursor-pointer text-black font-bold hover:bg-opacity-90"
                        disabled={!post.actions || post.actions.length === 0}
                      >
                        COLLECT NFT
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
}
