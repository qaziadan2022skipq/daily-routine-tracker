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

    const entries = await prisma.journalEntry.findMany({
      where: {
        date: date,
        userId: userId, // Uncomment this when using actual userId
      },
    });

    return NextResponse.json({ entries }, { status: 200 });
  } catch (error) {
    console.log("[JOURNAL_GET_ERROR]", error);
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
    const { date, content } = body;

    if (!date || !content) {
      return new NextResponse("Date and content are required", { status: 400 });
    }

    const entry = await prisma.journalEntry.create({
      data: {
        date: date,
        content,
        userId: userId, // Store userId with the journal entry
      },
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.log("[JOURNAL_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // const { userId } = auth();
    // if (!userId) {
    //   return new NextResponse("Unauthorized User", { status: 401 });
    // }

    const url = new URL(request.url);
    const entryId = url.searchParams.get("id");

    if (!entryId) {
      return new NextResponse("Entry ID is required", { status: 400 });
    }

    const entry = await prisma.journalEntry.delete({
      where: {
        id: entryId,
      },
    });

    return NextResponse.json(
      { message: "Entry deleted successfully", entry },
      { status: 200 }
    );
  } catch (error) {
    console.log("[JOURNAL_DELETE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
