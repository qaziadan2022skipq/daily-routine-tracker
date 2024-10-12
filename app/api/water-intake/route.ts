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

    const waterIntake = await prisma.waterIntake.findMany({
      where: {
        userId: userId,
      },
    });
    return NextResponse.json({ waterIntake }, { status: 200 });
  } catch (error) {
    console.log("[WATER_INTAKE_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized User", { status: 401 });
    }

    const { date, amount } = await request.json();
    const intake = await prisma.waterIntake.create({
      data: { date, amount, userId },
    });
    return NextResponse.json({ intake }, { status: 201 });
  } catch (error) {
    console.log("[WATER_INTAKE_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
