"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Coins, Zap, Heart, MessageSquare, Share2, Send } from "lucide-react"

interface WarDetailProps {
  warId: string
}

export default function WarDetail({ warId }: WarDetailProps) {
  const [message, setMessage] = useState("")
  const contributionFeedRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom of contribution feed
  useEffect(() => {
    if (contributionFeedRef.current) {
      contributionFeedRef.current.scrollTop = contributionFeedRef.current.scrollHeight
    }
  }, [])

  // Mock data for the war
  const war = {
    id: warId,
    clan1: {
      id: "clan-1",
      name: "CYBER WOLVES",
      logo: "/placeholder.svg?height=100&width=100",
    },
    clan2: {
      id: "clan-2",
      name: "NEON KNIGHTS",
      logo: "/placeholder.svg?height=100&width=100",
    },
    startDate: "May 10, 2023",
    endDate: "May 17, 2023",
    timeRemaining: "2d 14h",
    score: { clan1: 1240, clan2: 1180 },
    metrics: [
      { name: "Tips", clan1: 450, clan2: 380 },
      { name: "Followers", clan1: 320, clan2: 350 },
      { name: "NFT Sales", clan1: 18, clan2: 15 },
      { name: "Posts", clan1: 452, clan2: 435 },
    ],
  }

  // Mock data for contribution feed
  const contributionFeed = [
    {
      id: "contrib-1",
      user: { name: "0xCyb3r", avatar: "/placeholder.svg?height=50&width=50", clan: "clan1" },
      action: "tipped",
      target: "WolfByte's post",
      amount: "0.05 ETH",
      time: "2 hours ago",
    },
    {
      id: "contrib-2",
      user: { name: "NeonRider", avatar: "/placeholder.svg?height=50&width=50", clan: "clan2" },
      action: "collected",
      target: "Digital Warrior NFT",
      amount: "",
      time: "3 hours ago",
    },
    {
      id: "contrib-3",
      user: { name: "CryptoHowler", avatar: "/placeholder.svg?height=50&width=50", clan: "clan1" },
      action: "posted",
      target: "Strategy Update",
      amount: "",
      time: "4 hours ago",
    },
    {
      id: "contrib-4",
      user: { name: "LightKnight", avatar: "/placeholder.svg?height=50&width=50", clan: "clan2" },
      action: "gained",
      target: "5 new followers",
      amount: "",
      time: "5 hours ago",
    },
    {
      id: "contrib-5",
      user: { name: "AlphaWolf", avatar: "/placeholder.svg?height=50&width=50", clan: "clan1" },
      action: "tipped",
      target: "0xCyb3r's post",
      amount: "0.1 ETH",
      time: "6 hours ago",
    },
    {
      id: "contrib-6",
      user: { name: "NeonQueen", avatar: "/placeholder.svg?height=50&width=50", clan: "clan2" },
      action: "posted",
      target: "Rally Call",
      amount: "",
      time: "7 hours ago",
    },
  ]

  // Mock data for posts
  const posts = [
    {
      id: "post-1",
      user: { name: "0xCyb3r", avatar: "/placeholder.svg?height=50&width=50", clan: "clan1" },
      content:
        "Just dropped our new clan NFT collection! Collect them to support us in the war against NEON KNIGHTS. Every collection counts towards our victory!",
      image: "/placeholder.svg?height=300&width=500",
      likes: 24,
      comments: 8,
      time: "5 hours ago",
    },
    {
      id: "post-2",
      user: { name: "WolfByte", avatar: "/placeholder.svg?height=50&width=50", clan: "clan1" },
      content:
        "Strategy update: Focus on tipping and collecting today. We're leading in posts but falling behind in followers. Let's coordinate our efforts!",
      image: "",
      likes: 18,
      comments: 12,
      time: "8 hours ago",
    },
    {
      id: "post-3",
      user: { name: "CryptoHowler", avatar: "/placeholder.svg?height=50&width=50", clan: "clan1" },
      content:
        "Just created a new post about blockchain gaming. Check it out and give it some love to help us win this war!",
      image: "/placeholder.svg?height=300&width=500",
      likes: 32,
      comments: 5,
      time: "12 hours ago",
    },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Scoreboard */}
      <div className="lg:col-span-1">
        <div className="border border-[#a3ff12] bg-black bg-opacity-50 rounded-lg p-6">
          <h2 className="text-white font-bold text-xl mb-6 text-center">SCOREBOARD</h2>

          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col items-center">
              <Link href={`/clans/${war.clan1.id}`}>
                <Image
                  src={war.clan1.logo || "/placeholder.svg"}
                  alt={war.clan1.name}
                  width={80}
                  height={80}
                  className="rounded-full border-4 border-[#a3ff12] shadow-[0_0_10px_#a3ff12]"
                />
              </Link>
              <h3 className="text-white font-bold mt-2">{war.clan1.name}</h3>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold">
                <span className="text-[#a3ff12]">{war.score.clan1}</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-white">{war.score.clan2}</span>
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
                  className="rounded-full border-4 border-gray-700"
                />
              </Link>
              <h3 className="text-white font-bold mt-2">{war.clan2.name}</h3>
            </div>
          </div>

          <div className="space-y-4">
            {war.metrics.map((metric, index) => (
              <div key={index} className="border border-gray-800 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">{metric.name}</span>
                  <div className="flex items-center">
                    <span className="text-[#a3ff12] font-bold">{metric.clan1}</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-white font-bold">{metric.clan2}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#a3ff12] h-full rounded-full"
                    style={{
                      width: `${(metric.clan1 / (metric.clan1 + metric.clan2)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button className="w-full bg-[#a3ff12] text-black font-bold hover:bg-opacity-90">
              <Zap className="mr-2 h-4 w-4" />
              CONTRIBUTE NOW
            </Button>
          </div>
        </div>

        {/* Contribution Feed */}
        <div className="mt-8 border border-[#a3ff12] bg-black bg-opacity-50 rounded-lg p-6">
          <h2 className="text-white font-bold text-xl mb-4">CONTRIBUTION FEED</h2>

          <div ref={contributionFeedRef} className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {contributionFeed.map((contribution) => (
              <div
                key={contribution.id}
                className={`border ${contribution.user.clan === "clan1"
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
                      className={`font-bold ${contribution.user.clan === "clan1" ? "text-[#a3ff12]" : "text-white"
                        }`}
                    >
                      {contribution.user.name}
                    </span>
                    <span className="text-gray-400 text-xs ml-2">{contribution.time}</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    {contribution.action} {contribution.target}{" "}
                    {contribution.amount && <span className="text-[#a3ff12]">{contribution.amount}</span>}
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
              <TabsTrigger value="post" className="data-[state=active]:bg-[#a3ff12] data-[state=active]:text-black">
                CREATE POST
              </TabsTrigger>
              <TabsTrigger value="tip" className="data-[state=active]:bg-[#a3ff12] data-[state=active]:text-black">
                TIP POST
              </TabsTrigger>
              <TabsTrigger
                value="collect"
                className="data-[state=active]:bg-[#a3ff12] data-[state=active]:text-black"
              >
                COLLECT NFT
              </TabsTrigger>
            </TabsList>

            <TabsContent value="post" className="mt-4">
              <div className="space-y-4">
                <Textarea
                  placeholder="What's on your mind? Create a post to help your clan..."
                  className="bg-black border-gray-700 focus:border-[#a3ff12] min-h-[120px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="border-gray-700 text-gray-400">
                      <span className="sr-only">Upload image</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-700 text-gray-400">
                      <span className="sr-only">Add NFT</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path d="M11 5a3 3 0 11-6 0 3 3 0 016 0zm-9 8c0 1 1 1 1 1h5.256A4.493 4.493 0 018 12.5a4.49 4.49 0 011.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4z" />
                        <path d="M16 12.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zm-3.5-2a.5.5 0 00-.5.5v1h-1a.5.5 0 000 1h1v1a.5.5 0 001 0v-1h1a.5.5 0 000-1h-1v-1a.5.5 0 00-.5-.5z" />
                      </svg>
                    </Button>
                  </div>
                  <Button
                    className="bg-[#a3ff12] text-black font-bold hover:bg-opacity-90"
                    disabled={!message.trim()}
                  >
                    POST
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tip" className="mt-4">
              <div className="space-y-4">
                <div className="border border-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-bold mb-2">Select Post to Tip</h3>
                  <div className="space-y-2">
                    {posts.map((post, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border border-gray-800 rounded-lg p-3 hover:border-[#a3ff12] cursor-pointer"
                      >
                        <div className="flex items-center">
                          <Image
                            src={post.user.avatar || "/placeholder.svg"}
                            alt={post.user.name}
                            width={36}
                            height={36}
                            className="rounded-full"
                          />
                          <div className="ml-3">
                            <div className="text-white font-bold">{post.user.name}</div>
                            <div className="text-gray-400 text-xs">{post.time}</div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#a3ff12] text-[#a3ff12] hover:bg-[#a3ff12] hover:bg-opacity-10"
                        >
                          Select
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-bold mb-2">Tip Amount</h3>
                  <div className="flex space-x-2 mb-4">
                    {["0.01", "0.05", "0.1", "0.5", "1"].map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        className="border-gray-700 text-gray-300 hover:border-[#a3ff12] hover:text-[#a3ff12]"
                      >
                        {amount} ETH
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="Custom amount"
                      className="bg-black border-gray-700 focus:border-[#a3ff12]"
                    />
                    <span className="text-gray-400">ETH</span>
                  </div>
                </div>

                <Button className="w-full bg-[#a3ff12] text-black font-bold hover:bg-opacity-90">
                  SEND TIP
                  <Coins className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="collect" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="border border-gray-700 rounded-lg p-4 hover:border-[#a3ff12] cursor-pointer transition-all">
                    <div className="relative aspect-square mb-2">
                      <Image
                        src="/placeholder.svg?height=300&width=300"
                        alt="NFT"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="text-white font-bold">Cyber Wolf #042</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-400 text-sm">By 0xCyb3r</span>
                      <span className="text-[#a3ff12] font-bold">0.1 ETH</span>
                    </div>
                  </div>

                  <div className="border border-gray-700 rounded-lg p-4 hover:border-[#a3ff12] cursor-pointer transition-all">
                    <div className="relative aspect-square mb-2">
                      <Image
                        src="/placeholder.svg?height=300&width=300"
                        alt="NFT"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="text-white font-bold">Digital Howl #018</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-400 text-sm">By WolfByte</span>
                      <span className="text-[#a3ff12] font-bold">0.08 ETH</span>
                    </div>
                  </div>

                  <div className="border border-gray-700 rounded-lg p-4 hover:border-[#a3ff12] cursor-pointer transition-all">
                    <div className="relative aspect-square mb-2">
                      <Image
                        src="/placeholder.svg?height=300&width=300"
                        alt="NFT"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="text-white font-bold">Alpha Pack #007</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-400 text-sm">By CryptoHowler</span>
                      <span className="text-[#a3ff12] font-bold">0.15 ETH</span>
                    </div>
                  </div>

                  <div className="border border-gray-700 rounded-lg p-4 hover:border-[#a3ff12] cursor-pointer transition-all">
                    <div className="relative aspect-square mb-2">
                      <Image
                        src="/placeholder.svg?height=300&width=300"
                        alt="NFT"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="text-white font-bold">Night Hunter #029</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-400 text-sm">By AlphaWolf</span>
                      <span className="text-[#a3ff12] font-bold">0.12 ETH</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-[#a3ff12] text-black font-bold hover:bg-opacity-90">
                  COLLECT SELECTED NFT
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Clan Posts */}
        <div className="mt-8 border border-[#a3ff12] bg-black bg-opacity-50 rounded-lg p-6">
          <h2 className="text-white font-bold text-xl mb-4">CLAN POSTS</h2>

          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="border border-gray-800 rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center">
                    <Image
                      src={post.user.avatar || "/placeholder.svg"}
                      alt={post.user.name}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-[#a3ff12]"
                    />
                    <div className="ml-3">
                      <div className="text-white font-bold">{post.user.name}</div>
                      <div className="text-gray-400 text-xs">{post.time}</div>
                    </div>
                  </div>

                  <p className="text-gray-300 mt-3">{post.content}</p>

                  {post.image && (
                    <div className="mt-3 rounded-lg overflow-hidden">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt="Post image"
                        width={500}
                        height={300}
                        className="w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center text-gray-400 hover:text-[#a3ff12] transition-colors">
                        <Heart className="h-5 w-5 mr-1" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center text-gray-400 hover:text-[#a3ff12] transition-colors">
                        <MessageSquare className="h-5 w-5 mr-1" />
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center text-gray-400 hover:text-[#a3ff12] transition-colors">
                        <Share2 className="h-5 w-5 mr-1" />
                      </button>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#a3ff12] text-[#a3ff12] hover:bg-[#a3ff12] hover:bg-opacity-10"
                      >
                        <Coins className="h-4 w-4 mr-1" />
                        TIP
                      </Button>
                      <Button size="sm" className="bg-[#a3ff12] text-black font-bold hover:bg-opacity-90">
                        COLLECT NFT
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
