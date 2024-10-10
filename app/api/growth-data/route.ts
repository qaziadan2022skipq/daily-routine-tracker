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

    const growthData = await prisma.growthData.findMany({
      where: { userId },
    });
    return NextResponse.json({ growthData }, { status: 200 });
  } catch (error) {
    console.error("[GROWTH_DATA_GET_ERROR]", error);
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
    const { progress, date } = body;

    const growthEntry = await prisma.growthData.create({
      data: {
        userId,
        progress: body.progress,
        date: date,
      },
    });
    return NextResponse.json({ growthEntry }, { status: 201 });
  } catch (error) {
    console.error("[GROWTH_DATA_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
