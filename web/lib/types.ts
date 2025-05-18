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
