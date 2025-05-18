import type { FragmentOf } from "@lens-protocol/react";

import { AccountFragment } from "./account";
import { PostMetadataFragment } from "./post";

declare module "@lens-protocol/react" {
  export type LensAccount = FragmentOf<typeof AccountFragment>;
  export type PostMetadata = FragmentOf<typeof PostMetadataFragment>;
}

export const fragments = [AccountFragment, PostMetadataFragment];
