import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const userId = "1234";

export async function GET(request: NextRequest) {
  try {
    // const { userId } = auth();
    // if (!userId) {
    //   return new NextResponse("Unauthorized User", { status: 401 });
    // }

    const url = new URL(request.url);
    const date = url.searchParams.get("date");
    if (!date) {
      return new NextResponse("Date is required", { status: 400 });
    }

    const events = await prisma.event.findMany({
      where: {
        date: date,
        userId: userId, // Ensure events are associated with the user
      },
    });

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.log("[EVENTS_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // const { userId } = auth();
    // if (!userId) {
    //   return new NextResponse("Unauthorized User", { status: 401 });
    // }

    const body = await request.json();
    const { title, type, date, time, duration } = body;

    if (!title || !type || !date || !time) {
      return new NextResponse("Title, type, date, and time are required", {
        status: 400,
      });
    }

    const event = await prisma.event.create({
      data: {
        title,
        type,
        date: date,
        time,
        duration,
        userId, // Associate the event with the user
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.log("[EVENTS_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    //   const { userId } = auth();
    //   if (!userId) {
    //     return new NextResponse("Unauthorized User", { status: 401 });
    //   }

    const body = await request.json();
    const { id, title, type, time, duration, completed } = body;

    if (!id) {
      return new NextResponse("Event ID is required", { status: 400 });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: id },
      data: { title, type, time, duration, completed },
    });

    return NextResponse.json({ updatedEvent }, { status: 200 });
  } catch (error) {
    console.log("[EVENTS_PUT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    //   const { userId } = auth();
    //   if (!userId) {
    //     return new NextResponse("Unauthorized User", { status: 401 });
    //   }

    const url = new URL(request.url);
    const id = url.searchParams.get("id"); // Get the ID from the request query
    if (!id) {
      return new NextResponse("Event ID is required", { status: 400 });
    }

    await prisma.event.delete({
      where: { id: id },
    });

    return new NextResponse("Event deleted successfully", { status: 201 });
  } catch (error) {
    console.log("[EVENTS_DELETE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
