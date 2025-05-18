import { War } from "../schema/warSchema";
import { Snapshots } from "../schema/snapshotSchema";
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

export const getWarStats = async (id: string) => {
  let scoresOfClan1: ScoreMetrics = {
    bookmarks: 0,
    collects: 0,
    comments: 0,
    quotes: 0,
    upvotes: 0,
    tips: 0,
  };

  let scoresOfClan2: ScoreMetrics = {
    bookmarks: 0,
    collects: 0,
    comments: 0,
    quotes: 0,
    upvotes: 0,
    tips: 0,
  };

  console.log("id", id);
  const war = await War.findOne({ warId: id });
  console.log("war", war);
  if (!war) {
    throw new Error("War not found");
  }

  const clan1Snapshots = await Snapshots.find({
    warId: id,
    clanAddress: war.clan1,
  });
  const clan2Snapshots = await Snapshots.find({
    warId: id,
    clanAddress: war.clan2,
  });

  // Process clan1 snapshots
  for (const snapshot of clan1Snapshots) {
    const prevSnapshot = snapshot.snapshot;
    const currentSnapshot = await getPostDetails(snapshot.address);
    if (currentSnapshot) {
      // Calculate growth for each metric independently
      for (const key in scoresOfClan1) {
        const metricKey = key as keyof ScoreMetrics;
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

          scoresOfClan1[metricKey] += growth * userWeight;
        }
      }
    }
  }

  // Process clan2 snapshots
  for (const snapshot of clan2Snapshots) {
    const prevSnapshot = snapshot.snapshot;
    const currentSnapshot = await getPostDetails(snapshot.address);
    if (currentSnapshot) {
      // Calculate growth for each metric independently
      for (const key in scoresOfClan2) {
        const metricKey = key as keyof ScoreMetrics;
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

          scoresOfClan2[metricKey] += growth * userWeight;
        }
      }
    }
  }

  console.log("scoresOfClan1", scoresOfClan1);
  console.log("scoresOfClan2", scoresOfClan2);

  return {
    clan1: scoresOfClan1,
    clan2: scoresOfClan2,
  };
};
