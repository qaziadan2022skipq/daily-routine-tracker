import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const userId = "1234";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const inspirations = await prisma.inspiration.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ inspirations }, { status: 200 });
  } catch (error) {
    console.error("[INSPIRATIONS_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `
                  You are a professional motivational speaker and you inspire people.
                  Task: Give an inspirational quote so that they get motivated and make their daily routine good.
                  Topic: Daily Life
                  Audience: any
                  Format: Text
                  `,
        },
      ],
    });

    // Ensure response from OpenAI is valid
    if (!response || !response.choices || response.choices.length === 0) {
      return new NextResponse("No response from OpenAI", { status: 500 });
    }

    console.log(response.choices[0].message.content);

    const quote = response.choices[0].message.content || "";

    const inspiration = await prisma.inspiration.create({
      data: {
        content: quote,
        author: "any",
        category: "motivation",
        type: "quote",
      },
    });

    return NextResponse.json({ inspiration }, { status: 201 });
  } catch (error) {
    console.error("[INSPIRATIONS_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
