import { fetchPosts } from "@lens-protocol/client/actions";
import { client } from "../utils/client";
import { evmAddress } from "@lens-protocol/client";
export const getPostDetails = async (address: string) => {
  const result = await fetchPosts(client, {
    filter: {
      authors: [evmAddress(address)],
    },
  });

  if (result.isErr()) {
    return console.error(result.error);
  }
  const { items, pageInfo } = result.value;
  console.log(result.value);
  const post = items[0] as any;
  console.log(post.metadata);
  console.log(post.stats);
};
