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
  };

  for (const post of items) {
    const stats = (post as any).stats;
    aggregatedStats.bookmarks += stats.bookmarks;
    aggregatedStats.collects += stats.collects;
    aggregatedStats.comments += stats.comments;
    aggregatedStats.quotes += stats.quotes;
    aggregatedStats.upvotes += stats.upvotes;
    aggregatedStats.downvotes += stats.downvotes;
    aggregatedStats.reposts += stats.reposts;
    aggregatedStats.tips += stats.tips;
  }
  console.log(aggregatedStats);
  return aggregatedStats;
};
