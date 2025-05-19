"use client";
import React, { useEffect, useState } from "react";
import { evmAddress, postId } from "@lens-protocol/client";
import { executePostAction } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/ethers";
import { useSession } from "@/components/SessionContext";
import { Signer, Provider } from "@lens-chain/sdk/ethers";
import { lensProvider, browserProvider } from "@/lib/provider";
import { JsonRpcSigner } from "ethers";
import { fetchPredictionMarkets } from "@/lib/subgraphHandlers/fetchPredictionMarkets";
import { fetchWarClans } from "@/lib/subgraphHandlers/fetchWarClans";
import { fetchGroup } from "@lens-protocol/client/actions";
import { client } from "@/lib/client";
import { storageClient } from "@/lib/storage-client";

interface PredictionMarket {
  id: string;
  actions: {
    address?: string;
    config?: {
      key: string;
      data: string;
    }[];
  }[];
}

interface WarDetails {
  clan1?: { id: string };
  clan2?: { id: string };
  result?: string;
  timestamp?: string;
}

interface Group {
  address: string;
  timestamp: string;
  metadata: {
    description: string;
    id: string;
    icon: string;
    name: string;
    coverPicture: string | null;
  };
  owner: string;
}

const Page = () => {
  const [predictionMarkets, setPredictionMarkets] = useState<
    PredictionMarket[]
  >([]);
  const [warDetails, setWarDetails] = useState<Record<string, WarDetails>>({});
  const [clanDetails, setClanDetails] = useState<Record<string, Group>>({});
  const { sessionClient } = useSession();
  const [signer, setSigner] = useState<Signer | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMarkets = async () => {
    try {
      const markets = await fetchPredictionMarkets();
      setPredictionMarkets(markets);

      // Fetch war details for each market
      const warDetailsMap: Record<string, WarDetails> = {};
      for (const market of markets) {
        if (market.actions?.[0]?.config?.[0]?.data) {
          const warId = parseInt(
            market.actions[0].config[0].data,
            16
          ).toString();
          const details = await fetchWarClans(37111, warId);
          warDetailsMap[market.id] = details;

          // Fetch clan details for both clans
          if (details.clan1?.id) {
            const clan1Result = await fetchGroup(client, {
              group: evmAddress(details.clan1.id),
            });
            if (clan1Result.isOk()) {
              setClanDetails((prev) => ({
                ...prev,
                [details.clan1.id.toLowerCase()]: clan1Result.value as Group,
              }));
            }
          }
          if (details.clan2?.id) {
            const clan2Result = await fetchGroup(client, {
              group: evmAddress(details.clan2.id),
            });
            if (clan2Result.isOk()) {
              setClanDetails((prev) => ({
                ...prev,
                [details.clan2.id.toLowerCase()]: clan2Result.value as Group,
              }));
            }
          }
        }
      }
      setWarDetails(warDetailsMap);
    } catch (err) {
      console.error("Failed to fetch prediction markets:", err);
      setError("Failed to fetch prediction markets");
    }
  };

  useEffect(() => {
    const getSigner = async () => {
      if (!browserProvider) {
        return;
      }
      const network = await browserProvider.getNetwork();
      const ethersSigner = await browserProvider.getSigner();
      const signer = Signer.from(
        ethersSigner as unknown as JsonRpcSigner & { provider: Provider },
        Number(network.chainId),
        lensProvider
      );
      setSigner(signer);
    };
    getSigner();
  }, []);

  useEffect(() => {
    fetchMarkets();
  }, []);

  const vote = async (
    marketId: string,
    actionAddress: string,
    key1: string,
    key2: string,
    data1: string,
    data2: string
  ) => {
    try {
      console.log("Using contract address:", actionAddress);

      const result = await executePostAction(sessionClient!, {
        post: postId(marketId),
        action: {
          unknown: {
            address: evmAddress(actionAddress),
            params: [
              {
                key: key1,
                data: data1,
              },
              {
                key: key2,
                data: data2,
              },
            ],
          },
        },
      }).andThen(handleOperationWith(signer!));

      if (result.isErr()) {
        setError(result.error.message);
        console.error("Error executing post action:", result.error.message);
      } else {
        setError(null);
        console.log("Post action executed successfully:", result.value);
      }
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown error occurred";
      setError(errorMessage);
      console.error("Error in vote function:", errorMessage);
    }
  };

  const filteredMarkets = predictionMarkets.filter(
    (market) =>
      market.actions.length > 0 &&
      market.actions[0].address &&
      market.actions[0].config &&
      market.actions[0].config.length > 0
  );

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen text-white  py-10">
        <h1 className="text-4xl font-bold mb-8 pb-3 border-b w-full text-center container mx-auto max-w-5xl">Prediction Markets</h1>
        {error && (
          <div className="mb-4 p-4 bg-red-500 text-white rounded-lg">
            Error: {error}
          </div>
        )}
        <div className="grid mx-auto container max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full px-4">
          {filteredMarkets.length > 0 ? (
            filteredMarkets.map((market) => {
              const details = warDetails[market.id];
              const clan1Details = details?.clan1?.id
                ? clanDetails[details.clan1.id.toLowerCase()]
                : null;
              const clan2Details = details?.clan2?.id
                ? clanDetails[details.clan2.id.toLowerCase()]
                : null;
              const startDate = details?.timestamp
                ? new Date(Number(details.timestamp) * 1000)
                : null;
              const endDate = startDate
                ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
                : null;
              function formatDate(date: Date | null) {
                if (!date) return "?";
                return date.toLocaleDateString("en-GB");
              }
              return (
                <div
                  key={market.id}
                  className="relative bg-black rounded-2xl border border-[#232323] shadow-lg mb-2 w-full p-5 flex flex-col"
                >
                  {/* Main Content */}
                  <div className="flex flex-row items-center justify-between w-full">
                    {/* Clan 1 */}
                    <div className="flex flex-col items-center flex-1">
                      <div className="border-2 border-lime-400 rounded-full w-24 h-24 flex items-center justify-center mb-2 overflow-hidden">
                        <img
                          src={
                            clan1Details?.metadata?.icon
                              ? storageClient.resolve(
                                clan1Details.metadata.icon
                              )
                              : "/placeholder.svg"
                          }
                          alt={clan1Details?.metadata?.name || "Clan 1"}
                          className="w-20 h-20 object-cover rounded-full"
                        />
                      </div>
                      <div className="text-sm font-medium mt-2 mb-3">
                        {clan1Details?.metadata?.name || "Clan 1"}
                      </div>
                      <button
                        onClick={() =>
                          vote(
                            market.id,
                            market.actions[0].address!,
                            market.actions[0].config![0].key,
                            market.actions[0].config![1].key,
                            market.actions[0].config![0].data,
                            "0x0000000000000000000000000000000000000000000000000000000000000001"
                          )
                        }
                        className="w-full text-xs px-2 font-bold py-2 border-2 cursor-pointer border-[#FF4D00] hover:bg-[#FF4D00] text-white  transition-colors"
                      >
                        Vote for {clan1Details?.metadata?.name || "Clan 1"}
                      </button>
                    </div>
                    {/* VS and Dates */}
                    <div className="flex flex-col items-center flex-1">
                      <div className="text-2xl font-bold text-gray-400 mb-2">
                        VS
                      </div>
                      <div className="text-center text-white text-base">
                        {formatDate(startDate)}
                        <br />
                        to
                        <br />
                        {formatDate(endDate)}
                      </div>
                    </div>
                    {/* Clan 2 */}
                    <div className="flex flex-col items-center flex-1">
                      <div className="border-2 border-lime-400 rounded-full w-24 h-24 flex items-center justify-center mb-2 overflow-hidden">
                        <img
                          src={
                            clan2Details?.metadata?.icon
                              ? storageClient.resolve(
                                clan2Details.metadata.icon
                              )
                              : "/placeholder.svg"
                          }
                          alt={clan2Details?.metadata?.name || "Clan 2"}
                          className="w-20 h-20 object-cover rounded-full"
                        />
                      </div>
                      <div className="text-sm font-medium mt-2 mb-3">
                        {clan2Details?.metadata?.name || "Clan 2"}
                      </div>
                      <button
                        onClick={() =>
                          vote(
                            market.id,
                            market.actions[0].address!,
                            market.actions[0].config![0].key,
                            market.actions[0].config![1].key,
                            market.actions[0].config![0].data,
                            "0x0000000000000000000000000000000000000000000000000000000000000002"
                          )
                        }
                        className="w-full text-xs px-2 font-bold py-2 border-2 cursor-pointer border-[#FF4D00] hover:bg-[#FF4D00] text-white  transition-colors"
                      >
                        Vote for {clan2Details?.metadata?.name || "Clan 2"}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          ) : (
            <p className="text-gray-400">
              No prediction markets with unknown actions found.
            </p>
          )}
        </div>
      </div>
    </div >
  );
};

export default Page;
