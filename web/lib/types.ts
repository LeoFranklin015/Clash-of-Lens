export type Clan = {
  id: string;
  balance: string;
  owner: string;
  status: number;
};

export type Group = {
  address: string;
  timestamp: string;
  metadata: {
    description: string;
    id: string;
    icon: string;
    name: string;
    coverPicture: string | null;
  };
  owner: string;
};

export type ClanWithGroup = Clan & {
  group: Group;
};

export type Username = {
  __typename: "Username";
  id: string;
  value: string;
  localName: string;
  linkedTo: string;
  ownedBy: string;
  timestamp: string;
  namespace: string;
  operations: null;
};

export type AccountMetadata = {
  __typename: "AccountMetadata";
  attributes: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  bio: string;
  coverPicture: string | null;
  id: string;
  name: string;
  picture: string;
};

export type AccountFollowRules = {
  __typename: "AccountFollowRules";
  required: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  anyOf: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export type Account = {
  __typename: "Account";
  address: string;
  owner: string;
  score: number;
  createdAt: string;
  username: Username;
  metadata: AccountMetadata;
  operations: null;
  rules: AccountFollowRules;
  actions: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export type PostFeedInfo = {
  __typename: "PostFeedInfo";
  address: string;
  metadata: null;
  group: null;
};

export type App = {
  __typename: "App";
  address: string;
  createdAt: string;
  defaultFeedAddress: string;
  graphAddress: string;
  namespaceAddress: string;
  owner: string;
  sponsorshipAddress: string;
  treasuryAddress: string;
  verificationEnabled: boolean;
  hasAuthorizationEndpoint: boolean;
  metadata: null;
};

export type TextOnlyMetadata = {
  __typename: "TextOnlyMetadata";
  attributes: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  content: string;
  contentWarning: null;
  id: string;
  locale: string;
  mainContentFocus: string;
  tags: null;
};

export type PostStats = {
  __typename: "PostStats";
  bookmarks: number;
  collects: number;
  comments: number;
  quotes: number;
  upvotes: number;
  downvotes: number;
  reposts: number;
  tips: number;
};

export type PostRules = {
  __typename: "PostRules";
  required: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  anyOf: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export type NftMetadata = {
  __typename: "NftMetadata";
  animationUrl: null;
  attributes: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  description: null;
  externalUrl: null;
  image: null;
  name: null;
};

export type Post = {
  __typename: "Post";
  id: string;
  author: Account;
  slug: string;
  isDeleted: boolean;
  isEdited: boolean;
  timestamp: string;
  contentUri: string;
  snapshotUrl: string;
  feed: PostFeedInfo;
  app: App;
  metadata: TextOnlyMetadata;
  mentions: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  stats: PostStats;
  actions: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  rules: PostRules;
  operations: null;
  collectibleMetadata: NftMetadata;
  root: null;
  quoteOf: Post | null;
  commentOn: null;
};
