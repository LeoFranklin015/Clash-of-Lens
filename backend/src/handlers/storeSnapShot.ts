import { getGroupMembers } from "./getGroupMembers";
import { getPostDetails, PostStats } from "./getPostDetails";
import { Snapshots } from "../schema/snapshotSchema";
import { War } from "../schema/warSchema";

export const storeSnapShot = async (
  warId: string,
  clan1: string,
  clan2: string
) => {
  console.log("Storing snapshots for warId:", warId);
  console.log("Clan 1:", clan1);
  console.log("Clan 2:", clan2);
  const war = await War.create({
    warId,
    clan1,
    clan2,
  });
  const groupMembersOfClan1: any = await getGroupMembers(clan1);
  const groupMembersOfClan2: any = await getGroupMembers(clan2);

  // Store snapshots for clan 1
  await Promise.all(
    groupMembersOfClan1.map(async (member: any) => {
      const memberStats = await getPostDetails(member);
      if (memberStats) {
        await Snapshots.create({
          warId,
          clanAddress: clan1,
          address: member,
          snapshot: memberStats,
        });
      }
    })
  );

  // Store snapshots for clan 2
  await Promise.all(
    groupMembersOfClan2.map(async (member: any) => {
      const memberStats = await getPostDetails(member);
      if (memberStats) {
        await Snapshots.create({
          warId,
          clanAddress: clan2,
          address: member,
          snapshot: memberStats,
        });
      }
    })
  );

  // Calculate clan stats
  const clan1Snapshots = await Snapshots.find({ warId, clanAddress: clan1 });
  const clan2Snapshots = await Snapshots.find({ warId, clanAddress: clan2 });

  const calculateClanStats = (snapshots: any[]) => {
    return snapshots.reduce(
      (acc: PostStats, curr: any) => {
        const stats = curr.snapshot;
        return {
          bookmarks: acc.bookmarks + stats.bookmarks,
          collects: acc.collects + stats.collects,
          comments: acc.comments + stats.comments,
          quotes: acc.quotes + stats.quotes,
          upvotes: acc.upvotes + stats.upvotes,
          downvotes: acc.downvotes + stats.downvotes,
          reposts: acc.reposts + stats.reposts,
          tips: acc.tips + stats.tips,
        };
      },
      {
        bookmarks: 0,
        collects: 0,
        comments: 0,
        quotes: 0,
        upvotes: 0,
        downvotes: 0,
        reposts: 0,
        tips: 0,
      }
    );
  };

  const clanStats1 = calculateClanStats(clan1Snapshots);
  const clanStats2 = calculateClanStats(clan2Snapshots);

  return {
    clan1: clanStats1,
    clan2: clanStats2,
  };
};
