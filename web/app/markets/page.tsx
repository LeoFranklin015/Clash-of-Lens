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

const Page = () => {
  const [predictionMarkets, setPredictionMarkets] = useState<
    PredictionMarket[]
  >([]);
  const { sessionClient } = useSession();
  const [signer, setSigner] = useState<Signer | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMarkets = async () => {
    try {
      const markets = await fetchPredictionMarkets();
      setPredictionMarkets(markets);
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
      <div className="flex flex-col items-center justify-center min-h-screen text-white bg-gray-900 py-10">
        <h1 className="text-4xl font-bold mb-8">Prediction Markets</h1>
        {error && (
          <div className="mb-4 p-4 bg-red-500 text-white rounded-lg">
            Error: {error}
          </div>
        )}
        <div className="flex flex-col items-center justify-center w-full max-w-2xl px-4">
          {filteredMarkets.length > 0 ? (
            filteredMarkets.map((market) => (
              <div
                key={market.id}
                className="bg-gray-800 p-4 rounded-lg shadow-md mb-4 w-full"
              >
                <h2 className="text-xl font-semibold text-purple-400">
                  Market ID: {market.id}
                </h2>
                <div className="mt-4">
                  <p className="text-gray-300">
                    Contract Address: {market.actions[0].address}
                  </p>
                  <p className="text-gray-300 mt-2">
                    Config Data:{" "}
                    {market.actions[0].config?.[0]?.data || "No data"}
                  </p>
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
                    className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold"
                  >
                    Vote for option 1
                  </button>
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
                    className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold"
                  >
                    Vote for option 2
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">
              No prediction markets with unknown actions found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
