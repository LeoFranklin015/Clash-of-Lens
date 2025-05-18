import { getGroupMembers } from "./getGroupMembers";
import { getPostDetails, PostStats } from "./getPostDetails";

export const storeSnapShot = async (
  warId: string,
  clan1: string,
  clan2: string
) => {
  const groupMembersOfClan1: any = await getGroupMembers(clan1);
  const groupMembersOfClan2: any = await getGroupMembers(clan2);

  const clanStats1: PostStats = {
    bookmarks: 0,
    collects: 0,
    comments: 0,
    quotes: 0,
    upvotes: 0,
    downvotes: 0,
    reposts: 0,
    tips: 0,
  };

  const clanStats2: PostStats = {
    bookmarks: 0,
    collects: 0,
    comments: 0,
    quotes: 0,
    upvotes: 0,
    downvotes: 0,
    reposts: 0,
    tips: 0,
  };

  await Promise.all(
    groupMembersOfClan1.map(async (member: any) => {
      const memberStats = await getPostDetails(member);
      if (memberStats) {
        clanStats1.bookmarks += memberStats.bookmarks;
        clanStats1.collects += memberStats.collects;
        clanStats1.comments += memberStats.comments;
        clanStats1.quotes += memberStats.quotes;
        clanStats1.upvotes += memberStats.upvotes;
        clanStats1.downvotes += memberStats.downvotes;
        clanStats1.reposts += memberStats.reposts;
        clanStats1.tips += memberStats.tips;
      }
    })
  );

  await Promise.all(
    groupMembersOfClan2.map(async (member: any) => {
      const memberStats = await getPostDetails(member);
      if (memberStats) {
        clanStats2.bookmarks += memberStats.bookmarks;
        clanStats2.collects += memberStats.collects;
        clanStats2.comments += memberStats.comments;
        clanStats2.quotes += memberStats.quotes;
        clanStats2.upvotes += memberStats.upvotes;
        clanStats2.downvotes += memberStats.downvotes;
        clanStats2.reposts += memberStats.reposts;
        clanStats2.tips += memberStats.tips;
      }
    })
  );

  console.log("Clan 1 Total Stats:", clanStats1);
  console.log("Clan 2 Total Stats:", clanStats2);
  

  return {
    clan1: clanStats1,
    clan2: clanStats2,
  };
};
