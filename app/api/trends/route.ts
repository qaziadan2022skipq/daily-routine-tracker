// pages/api/trends/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const userId = "1234"
export async function GET() {
    try {
    //   const { userId } = auth();
    //   if (!userId) {
    //     return new NextResponse("Unauthorized User", { status: 401 });
    //   }
  
      // Fetch growth data for the user (this assumes you have a GrowthData model)
      const growthData = await prisma.growthData.findMany({
        where: { userId },
      });
  
      // Fetch sleep logs for the user
      const sleepLogs = await prisma.sleepLog.findMany({
        where: { userId },
      });
  
      // Fetch mood logs for the user
      const moodLogs = await prisma.moodLog.findMany({
        where: { userId },
      });
  
      // Generate insights
      const insights = [
        "Your productivity has shown a consistent upward trend over the past weeks.",
        "There's a strong correlation between your sleep quality and productivity levels.",
        "Your mood tends to improve following weeks of higher productivity.",
        "Consider focusing on sleep hygiene to potentially boost your overall well-being.",
      ];
  
      // Map the fetched data to the required format
      const trendData = growthData.map((log, index) => ({
        name: `Week ${index + 1}`,
        productivity: log.progress, // Using the actual progress from GrowthData
        mood: moodLogs[index]?.mood || 0,
        sleep: sleepLogs[index]?.hours || 0,
      }));

      console.log(trendData)
  
      return NextResponse.json({ trendData, insights }, { status: 200 });
    } catch (error) {
      console.log("[TRENDS_GET_ERROR]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }