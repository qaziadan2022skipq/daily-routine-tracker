import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userId = "1234";

export async function GET() {
  try {
    // const { userId } = auth();
    // if (!userId) {
    //   return new NextResponse("Unauthorized User", { status: 401 });
    // }

    const sleepLog = await prisma.sleepLog.findMany({
      where: {
        userId: userId,
      },
    });
    return NextResponse.json({ sleepLog }, { status: 200 });
  } catch (error) {
    console.log("[SLEEP_LOG_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // const { userId } = auth();
    // if (!userId) {
    //   return new NextResponse("Unauthorized User", { status: 401 });
    // }

    const body = await request.json();
    const { date, hours } = body;
    const log = await prisma.sleepLog.create({
      data: { date, hours, userId },
    });
    return NextResponse.json({ log }, { status: 201 });
  } catch (error) {
    console.log("[SLEEP_LOG_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
