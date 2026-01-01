"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    // 1. Check if industry exists first (OUTSIDE transaction)
    // This prevents locking the database while we wait for AI
    let industryInsight = await db.industryInsight.findUnique({
      where: {
        industry: data.industry,
      },
    });

    // 2. If it doesn't exist, generate AI insights (STILL OUTSIDE transaction)
    // This is the slow part that was causing the timeout
    if (!industryInsight) {
      const insights = await generateAIInsights(data.industry);

      // Now we have the data, we can create it safely
      // We use upsert inside the transaction just in case of race conditions
      // (e.g. if two users trigger this at the exact same time)
      industryInsight = {
        industry: data.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };
    }

    // 3. NOW start the transaction (Fast database operations only)
    const result = await db.$transaction(
      async (tx) => {
        // If we generated insights earlier, save them now
        if (!industryInsight.id) {
          await tx.industryInsight.upsert({
            where: { industry: data.industry },
            update: {}, // If it exists, do nothing
            create: industryInsight,
          });
        }

        // Fetch the industry again to be sure we have the relation ID if needed,
        // or just proceed with user update

        const updatedUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });

        return { updatedUser };
      },
      {
        timeout: 10000, // 10s is plenty now that AI is gone
      }
    );

    revalidatePath("/");
    return result.user;
  } catch (error) {
    console.error("Error updating user and industry:", error.message);
    throw new Error("Failed to update profile");
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        industry: true,
      },
    });

    return {
      isOnboarded: !!user?.industry,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    throw new Error("Failed to check onboarding status");
  }
}
