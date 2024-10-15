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

    const sessions = await prisma.meditationSession.findMany({
      where: { userId },
    });
    return NextResponse.json({ sessions }, { status: 200 });
  } catch (error) {
    console.error("[MEDITATION_GET_ERROR]", error);
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
    const { duration, date, reflection, mood } = body;

    let session: any;
    const oldSession = await prisma.meditationSession.findFirst({
      where: {
        userId,
        date,
      },
    });

    if (oldSession) {
      session = await prisma.meditationSession.update({
        where: {
          id: oldSession.id,
        },
        data: {
          duration: duration + oldSession.duration,
          reflection: reflection,
          mood: mood,
        },
      });
    } else {
      session = await prisma.meditationSession.create({
        data: {
          userId,
          duration: duration,
          reflection: reflection,
          mood: mood,
          date: date,
        },
      });
    }

    return NextResponse.json({ session }, { status: 201 });
  } catch (error) {
    console.error("[MEDITATION_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
