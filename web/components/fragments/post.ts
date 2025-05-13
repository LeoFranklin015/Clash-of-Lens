import { graphql } from "@lens-protocol/react";

export const PostMetadataFragment = graphql(
  `
    fragment PostMetadata on PostMetadata {
      __typename
      title
      content
      media {
        __typename
        ... on MediaImage {
          __typename
          full: item
          large: item(
            request: { preferTransform: { widthBased: { width: 2048 } } }
          )
          thumbnail: item(
            request: {
              preferTransform: { fixedSize: { height: 128, width: 128 } }
            }
          )
          altTag
          license
          type
        }
        ... on MediaVideo {
          __typename
          full: item
          large: item(
            request: { preferTransform: { widthBased: { width: 2048 } } }
          )
          thumbnail: item(
            request: {
              preferTransform: { fixedSize: { height: 128, width: 128 } }
            }
          )
          altTag
          license
          type
        }
      }
      attributes {
        key
        value
      }
    }
  `
);
