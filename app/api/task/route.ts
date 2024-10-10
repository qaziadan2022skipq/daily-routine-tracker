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

    const tasks = await prisma.task.findMany({
      where: { userId },
    });
    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error("[TASKS_GET_ERROR]", error);
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
    const { text } = body;

    const task = await prisma.task.create({
      data: {
        text: text,
        userId,
      },
    });
    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    console.error("[TASKS_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // const { userId } = auth();
    // if (!userId) {
    //   return new NextResponse("Unauthorized User", { status: 401 });
    // }

    const body = await request.json();
    const { taskId, completed } = body;

    const task = await prisma.task.update({
      where: { id: body.taskId },
      data: { completed: body.completed },
    });
    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    console.error("[TASKS_PUT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
