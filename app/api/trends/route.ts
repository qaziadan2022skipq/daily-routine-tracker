import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prisma = new PrismaClient();

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized User", { status: 401 });
    }

    // Fetching data from various models for the user
    const tasks = await prisma.task.findMany({ where: { userId } });
    const sleepLogs = await prisma.sleepLog.findMany({ where: { userId } });
    const moodLogs = await prisma.moodLog.findMany({ where: { userId } });
    const books = await prisma.book.findMany({ where: { userId } });
    const waterIntakeLogs = await prisma.waterIntake.findMany({
      where: { userId },
    });
    const meditationSessions = await prisma.meditationSession.findMany({
      where: { userId },
    });
    const dailyLogs = await prisma.dailyLog.findMany({ where: { userId } });
    const exercises = await prisma.exercise.findMany({ where: { userId } });

    // Generate insights based on the collected data

    // const insights = [
    //     "Your productivity has shown a consistent upward trend over the past weeks.",
    //     "There's a strong correlation between your sleep quality and productivity levels.",
    //     "Your mood tends to improve following weeks of higher productivity.",
    //     "Consider focusing on sleep hygiene to potentially boost your overall well-being.",
    //     "Stay hydrated! Your water intake is essential for maintaining energy levels.",
    //     // Add more insights based on your analysis
    // ];

    // Map the fetched data to the required format
    const trendData = tasks.map((task, index) => ({
      name: `Day ${index + 1}`,
      productivity: task.completed ? 1 : 0,
      mood: moodLogs[index]?.mood || 0,
      sleep: sleepLogs[index]?.hours || 0,
      booksRead: books.length, // Example: Total number of books read
      waterIntake: waterIntakeLogs[index]?.amount || 0,
      meditationDuration: meditationSessions[index]?.duration || 0,
      exerciseIntensity: exercises[index]?.intensity || "None",
      dailyCognitive: dailyLogs[index]?.cognitive || 0,
      dailyEnergy: dailyLogs[index]?.energy || 0,
    }));
    let response: any;
    if (trendData) {
      const data = JSON.stringify(trendData);
      response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: `
                        You are a professional daily routine analyzer.
                        Task: The user data is given below please generate 7 insights on basis of data given below
                        The optput should be of 7 line. 1 line for wach insight
                        Topic: Daily Life
                        data: ${data}
                        `,
          },
        ],
      });
    }

    const insights = response.choices[0].message.content;

    console.log(insights);

    return NextResponse.json({ trendData, insights }, { status: 200 });
  } catch (error) {
    console.log("[TRENDS_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export const dynamic = "force-dynamic";
