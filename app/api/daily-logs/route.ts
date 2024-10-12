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

    const dailyLogs = await prisma.dailyLog.findMany({
      where: {
        userId: userId,
      },
    });
    return NextResponse.json({ dailyLogs }, { status: 200 });
  } catch (error) {
    console.log("[DAILY_LOGS_GET_ERROR]", error);
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
    const { date, cognitive, energy, hydration, supplements } = body;

    const dailyLog = await prisma.dailyLog.create({
      data: {
        date,
        cognitive,
        energy,
        hydration,
        userId,
        supplements, // Assuming you store this as JSON
      },
    });
    return NextResponse.json({ dailyLog }, { status: 201 });
  } catch (error) {
    console.log("[DAILY_LOGS_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Optional: PUT for updating a daily log
export async function PUT(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized User", { status: 401 });
    }

    const body = await request.json();
    const { logId, cognitive, energy, hydration, supplements } = body;

    const dailyLog = await prisma.dailyLog.update({
      where: { id: logId },
      data: {
        cognitive,
        energy,
        hydration,
        supplements, // Assuming you update supplements as well
      },
    });
    return NextResponse.json({ dailyLog }, { status: 200 });
  } catch (error) {
    console.log("[DAILY_LOGS_PUT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
