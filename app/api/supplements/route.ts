import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const userId = "1234"
export async function GET() {
  try {
    // const { userId } = auth();
    // if (!userId) {
    //   return new NextResponse("Unauthorized User", { status: 401 });
    // }

    const supplements = await prisma.supplement.findMany({
      where: {
        userId: userId,
      },
    });
    return NextResponse.json({ supplements }, { status: 200 });
  } catch (error) {
    console.log("[SUPPLEMENTS_GET_ERROR]", error);
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
    const { name, dosage, time } = body;

    const supplement = await prisma.supplement.create({
      data: {
        name,
        dosage,
        time,
        userId,
      },
    });
    return NextResponse.json({ supplement }, { status: 201 });
  } catch (error) {
    console.log("[SUPPLEMENTS_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Optional: DELETE for removing a supplement
export async function DELETE(request: NextRequest) {
  try {
    // const { userId } = auth();
    // if (!userId) {
    //   return new NextResponse("Unauthorized User", { status: 401 });
    // }
    const supplementId = request.nextUrl.searchParams.get("id")
    if (!supplementId){
        return NextResponse.json({ message: "Supplement Id not found" }, { status: 404 });
    }
    await prisma.supplement.delete({
      where: { id: supplementId },
    });

    return NextResponse.json({ message: "Supplement deleted successfully" }, { status: 200 });
  } catch (error) {
    console.log("[SUPPLEMENT_DELETE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
