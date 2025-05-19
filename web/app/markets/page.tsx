"use client";
import React, { useEffect, useState } from "react";
import { fetchPosts } from "@lens-protocol/client/actions";
import { client } from "@/lib/client";
import { evmAddress, postId } from "@lens-protocol/client";
import { executePostAction } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/ethers";
import { useEthersSigner } from "@/lib/walletClientToSigner";
import { useSession } from "@/components/SessionContext";
import { Signer, Provider } from "@lens-chain/sdk/ethers";
import { lensProvider, browserProvider } from "@/lib/provider";
import { JsonRpcSigner } from "ethers";

// Using a more generic type for Post based on the provided JSON structure
interface PostAction {
  __typename: string;
  // other action properties...
}

interface PostMetadata {
  content?: string;
  // other metadata properties...
}

interface LensPost {
  id: string;
  actions: PostAction[];
  metadata: PostMetadata;
  // other post properties from your JSON...
}

const Page = () => {
  const [posts, setPosts] = useState<LensPost[]>([]);
  const { sessionClient } = useSession();
  // const signer = useEthersSigner();
  const [signer, setSigner] = useState<Signer | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = async () => {
    const result = await fetchPosts(client, {
      filter: {
        authors: [evmAddress("0x446e9e88Dc725f236527535a44Ae1fdEfbC47B55")],
      },
    });

    if (result.isOk()) {
      const items = result.value.items as unknown as LensPost[];
      setPosts(items);
    } else if (result.isErr()) {
      console.error(
        "Failed to fetch posts:",
        result.error?.message || "Unknown error"
      );
      setPosts([]);
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
    fetchPost();
  }, []);

  const filteredPosts = posts.filter(
    (post) =>
      Array.isArray(post.actions) &&
      post.actions.some((action) => action.__typename === "UnknownPostAction")
  );

  const vote = async () => {
    try {
      // The contract address for the unknown action
      const contractAddress = "0x8A5fA1b0A754Ca969a748bF507b41c76aB43DC97";

      // Log the address being used
      console.log("Using contract address:", contractAddress);

      // Verify the address is valid
      if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
        throw new Error("Invalid contract address format");
      }

      const result = await executePostAction(sessionClient!, {
        post: postId(
          "113384720024951229807404353929314120004015724350817904136507870003647521392978"
        ),
        action: {
          unknown: {
            address: evmAddress(contractAddress),
            params: [
              {
                key: "0xc4b43ac09e131e6a42c80d3aef32e77c3bc28d5423789bcfbfcf8be0feac708d",
                data: "0x0000000000000000000000000000000000000000000000000000000000000001",
              },
              {
                key: "0x5db60783da8fbb85fb7e3f94133fddb5a81cde2c804f358f6db1854a56ea10e0",
                data: "0x0000000000000000000000000000000000000000000000000000000000000001",
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

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen text-white bg-gray-900 py-10">
        <h1 className="text-4xl font-bold mb-8">Markets</h1>
        {error && (
          <div className="mb-4 p-4 bg-red-500 text-white rounded-lg">
            Error: {error}
          </div>
        )}
        <div className="flex flex-col items-center justify-center w-full max-w-2xl px-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-gray-800 p-4 rounded-lg shadow-md mb-4 w-full"
              >
                <h2 className="text-xl font-semibold text-purple-400">
                  Post ID: {post.id}
                </h2>
                <p className="text-gray-300 mt-2">
                  Content: {post.metadata?.content || "No content"}
                </p>
                <button
                  onClick={vote}
                  className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold"
                >
                  Vote
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400">
              {`No posts found with "UnknownPostAction".`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
