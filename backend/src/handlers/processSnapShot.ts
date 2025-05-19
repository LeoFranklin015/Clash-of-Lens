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
} as const;

type ScoreMetrics = {
  bookmarks: number;
  collects: number;
  comments: number;
  quotes: number;
  upvotes: number;
  downvotes: number;
  reposts: number;
  tips: number;
};

type MetricKey = keyof typeof METRIC_WEIGHTS;

// Helper: calculate growth for a single metric
const calculateMetricGrowth = (prev: number, curr: number, weight: number) => {
  let growth = 0;
  if (prev === 0 && curr === 0) growth = 0;
  else if (prev === 0) growth = curr * 100;
  else growth = ((curr - prev) / prev) * 100;

  return growth * weight;
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
      if (currentSnapshot) {
        let snapshotScore = 0;
        // Calculate growth for each metric independently
        for (const key in METRIC_WEIGHTS) {
          const metricKey = key as MetricKey;
          const prev = prevSnapshot[metricKey] || 0;
          const curr = currentSnapshot[metricKey] || 0;

          if (prev !== curr) {
            const growth = calculateMetricGrowth(
              prev,
              curr,
              METRIC_WEIGHTS[metricKey]
            );

            // Apply user activity weighting
            const activityVolume = Object.values(currentSnapshot).reduce(
              (a, b) => a + (typeof b === "number" ? b : 0),
              0
            );
            const userWeight = activityVolume < 5 ? 1.3 : 1;

            snapshotScore += growth * userWeight;
          }
        }
        clan1Score += snapshotScore;
      }
    }

    // Process clan2 snapshots
    for (const snapshot of clan2Snapshots) {
      const prevSnapshot = snapshot.snapshot;
      const currentSnapshot = await getPostDetails(snapshot.address);
      if (currentSnapshot) {
        let snapshotScore = 0;
        // Calculate growth for each metric independently
        for (const key in METRIC_WEIGHTS) {
          const metricKey = key as MetricKey;
          const prev = prevSnapshot[metricKey] || 0;
          const curr = currentSnapshot[metricKey] || 0;

          if (prev !== curr) {
            const growth = calculateMetricGrowth(
              prev,
              curr,
              METRIC_WEIGHTS[metricKey]
            );

            // Apply user activity weighting
            const activityVolume = Object.values(currentSnapshot).reduce(
              (a, b) => a + (typeof b === "number" ? b : 0),
              0
            );
            const userWeight = activityVolume < 5 ? 1.3 : 1;

            snapshotScore += growth * userWeight;
          }
        }
        clan2Score += snapshotScore;
      }
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
