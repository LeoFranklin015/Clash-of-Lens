import { fetchPosts, post } from "@lens-protocol/client/actions";
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
  console.log(address);
  for (const post of items) {
    console.log((post as any).stats);
  }
  //   ```
  //   {
  //   __typename: 'PostStats',
  //   bookmarks: 0,
  //   collects: 0,
  //   comments: 0,
  //   quotes: 0,
  //   upvotes: 0,
  //   downvotes: 0,
  //   reposts: 0,
  //   tips: 0
  // }
  //   ```;
};
