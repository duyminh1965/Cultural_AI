/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { eq } from "drizzle-orm";
import { db } from "../drizzle";
import { culturalProfile } from "../schema";
import { CulturalProfile } from "@/types";

export const CulturalProfileOne = async (userId: string):Promise<CulturalProfile> => {
  try {
    const profile = await db
      .select()
      .from(culturalProfile)
      .where(eq(culturalProfile.userId, userId));
    if (profile.length > 0) {
      //console.log('✅ Cultural profile retrieved successfully',profile[0] );
      return profile[0] as CulturalProfile;
    } else {
      return {} as CulturalProfile;
    }
  } catch (error) {
    console.error("❌ Error creating cultural profile:", error);
    return {} as CulturalProfile;
  }
};

export const UpdateCulturalProfile = async ({
  userId,
  aiAnalysis,
  preferences,
}: {
  userId: string;
  aiAnalysis: any;
  preferences: any;
}) => {
  try {
    let profile = (await CulturalProfileOne(userId)) as CulturalProfile;
    if (!profile.id) {
      await db.insert(culturalProfile).values({ userId });
      profile = (await CulturalProfileOne(userId)) as CulturalProfile;
    }
    // Merge AI insights with existing profile
    const preferencesmerge = mergeAndNormalizePreferences(
      profile.preferences as any || {},
      preferences as any
    );
    console.log("preferencesmerge aiAnalysis.tasteData: ", aiAnalysis);
    profile.personalityTraits =
      aiAnalysis.personalityTraits || profile.personalityTraits;
    profile.culturalAffinities =
      aiAnalysis.culturalAffinities || profile.culturalAffinities;
    profile.tasteMap = aiAnalysis.connections || profile.tasteMap;
    profile.tasteData = aiAnalysis.tasteData || profile.tasteData;

    profile.completedOnboarding = true;
    profile.lastUpdated = new Date();
    await db
      .update(culturalProfile)
      .set({
        preferences: preferencesmerge,
        tasteMap: profile.tasteMap,
        tasteData: profile.tasteData,
        personalityTraits: profile.personalityTraits,
        culturalAffinities: profile.culturalAffinities,
        completedOnboarding: profile.completedOnboarding,
        lastUpdated: profile.lastUpdated,
      })
      .where(eq(culturalProfile.userId, userId));
    console.log("preferencesmerge: OK");

    return profile;
  } catch (error) {
    console.log("❌ Error updating cultural profile:", error);
    return { } as CulturalProfile;
  }
};

function normalizeLabel(label: string): string {
  return label
    .toLowerCase()
    .replace(/\(.*?\)/g, "") // remove anything in parentheses
    .replace(/e\.g\./gi, "") // remove "e.g."
    .replace(/[^a-z0-9\s\-]/gi, "") // remove special chars
    .replace(/\s+/g, " ") // collapse spaces
    .trim();
}

function mergeAndNormalizePreferences( 
  prefA: Record<string, string[]>,
  prefB: Record<string, string[]>
): Record<string, string[]> {
  const merged: Record<string, string[]> = {};

  const allKeys = new Set([...Object.keys(prefA), ...Object.keys(prefB)]);

  for (const key of allKeys) {
    const rawItems = [...(prefA[key] || []), ...(prefB[key] || [])];

    const seen = new Map<string, string>(); // normalized → original

    for (const item of rawItems) {
      const norm = normalizeLabel(item);
      if (!seen.has(norm)) {
        seen.set(norm, item);
      }
    }

    merged[key] = Array.from(seen.values());
  }

  return merged;
}
