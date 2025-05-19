import { Snapshots } from "../schema/snapshotSchema";
import { War } from "../schema/warSchema";
import { ClashOfLensAddress, ClashOfLensABI } from "../utils/abi";
import { walletClient } from "../utils/client";
import { getPostDetails } from "./getPostDetails";

// Define metric weights
const METRIC_WEIGHTS = {
  bookmarks: 1,
  collects: 3,
  comments: 2,
  quotes: 2,
  upvotes: 1.5,
  downvotes: -2,
  reposts: 2,
  tips: 4,
};

// Helper: calculate % growth-based weighted score
const calculateScoreGrowth = (initial: any, current: any) => {
  let total = 0;

  for (const key in METRIC_WEIGHTS) {
    const prev = initial[key] || 0;
    const curr = current[key] || 0;

    let growth = 0;
    if (prev === 0 && curr === 0) growth = 0;
    else if (prev === 0) growth = curr * 100;
    else growth = ((curr - prev) / prev) * 100;

    const weighted =
      growth * METRIC_WEIGHTS[key as keyof typeof METRIC_WEIGHTS];
    total += weighted;
  }

  const activityVolume: any = Object.values(current).reduce(
    (a: any, b: any) => a + b,
    0
  );
  const userWeight = activityVolume < 5 ? 1.3 : 1;

  return total * userWeight;
};

export const processSnapShot = async () => {
  const war = await War.find({
    completed: false,
    createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });
  console.log(war.length);
  for (const w of war) {
    const clan1 = w.clan1;
    const clan2 = w.clan2;
    console.log(clan1, clan2);

    const clan1Snapshots = await Snapshots.find({
      warId: w.warId,
      clanAddress: clan1,
    });
    const clan2Snapshots = await Snapshots.find({
      warId: w.warId,
      clanAddress: clan2,
    });

    let clan1Score = 0;
    let clan2Score = 0;

    // Process clan1 snapshots
    for (const snapshot of clan1Snapshots) {
      const prevSnapshot = snapshot.snapshot;
      const currentSnapshot = await getPostDetails(snapshot.address);
      const score = calculateScoreGrowth(prevSnapshot, currentSnapshot);
      clan1Score += score;
    }

    // Process clan2 snapshots
    for (const snapshot of clan2Snapshots) {
      const prevSnapshot = snapshot.snapshot;
      const currentSnapshot = await getPostDetails(snapshot.address);
      const score = calculateScoreGrowth(prevSnapshot, currentSnapshot);
      clan2Score += score;
    }

    let result = 0;
    if (clan1Score > clan2Score) {
      result = clan1;
      await walletClient.writeContract({
        address: ClashOfLensAddress,
        abi: ClashOfLensABI,
        functionName: "declareVictory",
        args: [w.warId, 1],
      });
    } else if (clan2Score > clan1Score) {
      result = clan2;
      await walletClient.writeContract({
        address: ClashOfLensAddress,
        abi: ClashOfLensABI,
        functionName: "declareVictory",
        args: [w.warId, 2],
      });
    } else {
      result = 0;
    }

    w.result = result;
    w.completed = true;
    await w.save();

    await Snapshots.updateMany({ warId: w.warId }, { completed: true });

    console.log(
      `✅ War ${
        w.warId
      } result: Clan ${result} wins | Clan1: ${clan1Score.toFixed(
        2
      )} vs Clan2: ${clan2Score.toFixed(2)}`
    );
  }
};
