// pages/api/checkAchievements.js

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request:NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    // Define achievements and the logic to check them
    const achievements = [
      {
        title: "30-Day Streak",
        check: async () => {
          const streakCount = await prisma.dailyLog.count({
            where: {
              userId,
              createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
            },
          });
          return streakCount >= 30;
        },
      },
      {
        title: "Goal Crusher",
        check: async () => {
          const goalsCompleted = await prisma.task.count({
            where: {
              userId,
              completed: true,
            },
          });
          return goalsCompleted >= 5;
        },
      },
      {
        title: "Bookworm",
        check: async () => {
          const booksRead = await prisma.book.count({
            where: {
              userId,
              createdAt: { gte: new Date(new Date().getFullYear(), 0, 1) },
            },
          });
          return booksRead >= 10;
        },
      },
      {
        title: "Hydration Hero",
        check: async () => {
          const hydrationCount = await prisma.waterIntake.count({
            where: {
              userId,
              createdAt: { gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
            },
          });
          return hydrationCount >= 14; // Assuming you log hydration daily
        },
      },
      {
        title: "Sleep Master",
        check: async () => {
          const sleepLogs = await prisma.sleepLog.count({
            where: {
              userId,
              createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
            },
          });
          return sleepLogs >= 30; // Assuming daily sleep logs
        },
      },
      {
        title: "Productivity Powerhouse",
        check: async () => {
          const tasksCompleted = await prisma.task.count({
            where: {
              userId,
              completed: true,
              createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            },
          });
          return tasksCompleted >= 7; // All tasks completed for the week
        },
      },
      {
        title: "Zen Master",
        check: async () => {
          const meditationSessions = await prisma.meditationSession.count({
            where: {
              userId,
              createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            },
          });
          return meditationSessions >= 7; // Daily meditation for a week
        },
      },
      {
        title: "Mindfulness Guru",
        check: async () => {
          const sessions = await prisma.meditationSession.count({
            where: { userId },
          });
          return sessions >= 30; // 30 meditation sessions total
        },
      },
      {
        title: "Reflection Pro",
        check: async () => {
          const reflections = await prisma.journalEntry.count({
            where: {
              userId,
              createdAt: { gte: new Date(Date.now() - 10 * 7 * 24 * 60 * 60 * 1000) },
            },
          });
          return reflections >= 10; // 10 weekly reflections
        },
      },
      {
        title: "Growth Champion",
        check: async () => {
          const growthRecords = await prisma.growthData.count({
            where: {
              userId,
              createdAt: { gte: new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000) },
            },
          });
          return growthRecords >= 3; // Monthly growth logs for 3 months
        },
      },
    ];

    // Check all achievements and gather results
    const results = await Promise.all(
      achievements.map(async (achievement) => ({
        title: achievement.title,
        unlocked: await achievement.check(),
      }))
    );

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("[CHECK_ACHIEVEMENTS_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
