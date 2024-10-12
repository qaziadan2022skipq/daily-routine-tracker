import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized User", { status: 401 });
    }

    const moodLog = await prisma.moodLog.findMany({
      where: {
        userId: userId,
      },
    });
    return NextResponse.json({ moodLog }, { status: 200 });
  } catch (error) {
    console.log("[MOOD_LOG_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized User", { status: 401 });
    }

    const body = await request.json();
    const { date, mood } = body;
    const moodEntry = await prisma.moodLog.create({
      data: { date, mood, userId },
    });
    return NextResponse.json({ moodEntry }, { status: 201 });
  } catch (error) {
    console.log("[MOOD_LOG_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
