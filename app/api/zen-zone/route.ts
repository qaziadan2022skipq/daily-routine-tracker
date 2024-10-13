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

    const meditationLogs = await prisma.zenZone.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ meditationLogs }, { status: 200 });
  } catch (error) {
    console.log("[MEDITATION_LOGS_GET_ERROR]", error);
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
    const { date, duration, reflection, mood } = body;
    console.log( date, duration, reflection, mood)

    const meditationLog = await prisma.zenZone.create({
      data: {
        userId: userId,
        date,
        duration,
        reflection,
        mood,
      },
    });

    return NextResponse.json({ meditationLog }, { status: 201 });
  } catch (error) {
    console.log("[MEDITATION_LOGS_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized User", { status: 401 });
    }

    const body = await request.json();
    const { logId, duration, reflection, mood } = body;

    const meditationLog = await prisma.zenZone.update({
      where: { id: logId },
      data: { duration, reflection, mood },
    });

    return NextResponse.json({ meditationLog }, { status: 200 });
  } catch (error) {
    console.log("[MEDITATION_LOGS_PUT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
