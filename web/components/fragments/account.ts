import {
  UsernameFragment,
  AccountMetadataFragment as LensAccountMetadataFragment,
  graphql,
} from "@lens-protocol/react";

export const AccountFragment = graphql(
  `
    fragment Account on Account {
      __typename
      username {
        ...Username
      }
      address
      metadata {
        ...AccountMetadata
      }
    }
  `,
  [UsernameFragment, LensAccountMetadataFragment]
);
