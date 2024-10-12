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

    const books = await prisma.book.findMany({
        where: {
            userId: userId
        }
    });
    return NextResponse.json({ books }, { status: 200 });
  } catch (error) {
    console.log("[BOOKS_GET_ERROR]", error);
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
    const { title, author, startDate } = body;
    console.log(title, author, startDate)
    const book = await prisma.book.create({
      data: {
        title: title,
        author: author,
        startDate: startDate,
        endDate: "",
        userId: userId,
      },
    });
    return NextResponse.json({ book }, { status: 201 });
  } catch (error) {
    console.log("[BOOKS_POST_ERROR]", error);
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
    const { bookId, endDate } = body
    const book = await prisma.book.update({
      where: { id:bookId },
      data: { endDate },
    });
    return NextResponse.json({ book }, { status: 200 });
  } catch (error) {
    console.log("[BOOKS_PUT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
