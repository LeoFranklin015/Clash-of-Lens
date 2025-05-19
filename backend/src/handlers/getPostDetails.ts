import { fetchPosts, post } from "@lens-protocol/client/actions";
import { client } from "../utils/client";
import { evmAddress } from "@lens-protocol/client";

export interface PostStats {
  bookmarks: number;
  collects: number;
  comments: number;
  quotes: number;
  upvotes: number;
  downvotes: number;
  reposts: number;
  tips: number;
  address: string;
}

export const getPostDetails = async (address: string) => {
  const result = await fetchPosts(client, {
    filter: {
      authors: [evmAddress(address)],
    },
  });

  if (result.isErr()) {
    return console.error(result.error);
  }

  const { items } = result.value;

  const aggregatedStats: PostStats = {
    bookmarks: 0,
    collects: 0,
    comments: 0,
    quotes: 0,
    upvotes: 0,
    downvotes: 0,
    reposts: 0,
    tips: 0,
    address: address,
  };

  for (const post of items) {
    const stats = (post as any).stats;
    if (stats) {
      aggregatedStats.bookmarks += stats.bookmarks || 0;
      aggregatedStats.collects += stats.collects || 0;
      aggregatedStats.comments += stats.comments || 0;
      aggregatedStats.quotes += stats.quotes || 0;
      aggregatedStats.upvotes += stats.upvotes || 0;
      aggregatedStats.downvotes += stats.downvotes || 0;
      aggregatedStats.reposts += stats.reposts || 0;
      aggregatedStats.tips += stats.tips || 0;
    }
  }
  console.log(aggregatedStats);
  return aggregatedStats;
};
