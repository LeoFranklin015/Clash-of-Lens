const POSTS_QUERY = `
  query Posts($request: PostsRequest!) {
    posts(request: $request) {
      items {
        ... on Post {
          actions {
            ... on UnknownPostAction {
              address
              config {
                data
                key
              }
            }
          }
          id
        }
      }
    }
  }
`;

const variables = {
  request: {
    filter: {
      authors: ["0x83C3A17E22d2fDa97006c0Bc56107C56B234d802"],
    },
  },
};

export async function fetchPredictionMarkets() {
  try {
    const response = await fetch("https://api.lens.xyz/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: POSTS_QUERY,
        variables: variables,
      }),
    });

    const data = await response.json();
    console.log(data.data.posts.items);
    return data.data.posts.items;
  } catch (error) {
    console.error("Error fetching prediction markets:", error);
    throw error;
  }
}
