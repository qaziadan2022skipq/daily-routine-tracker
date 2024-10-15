import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prisma = new PrismaClient();
interface Quote {
  quote: string;
  author: string;
  category: string;
}
interface Tip {
  tip: string;
  author: string;
  category: string;
}
export async function GET(request: Request) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `
                  You are a professional motivational speaker and you inspire people.
                  Task: Give an inspirational quote so that they get motivated and make their life better.
                  Topic: Daily Life
                  Audience: any
                  Format: JSON
                  {
                      "quote": "string",
                      "author": "author name",
                      "category": "category name"
                  }
                  `,
        },
      ],
      response_format: { type: "json_object" },
    });
    // Ensure response from OpenAI is valid
    if (!response || !response.choices || response.choices.length === 0) {
      return new NextResponse("No response from OpenAI", { status: 500 });
    }

    const tips = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `
                  Your are a professional daily rotine  improvement advisor
                  Task: Share some tips in paragraph with user so that they can imporve daily routine.
                  Topic: Daily Life and improvement
                  Audience: any
                  Format: JSON
                  {
                      "tip": "string",
                      "author": "author name",
                      "category": "category name"
                  }
                  `,
        },
      ],
      response_format: { type: "json_object" },
    });
    // Ensure response from OpenAI is valid
    if (!tips || !tips.choices || tips.choices.length === 0) {
      return new NextResponse("No response from OpenAI", { status: 500 });
    }

    console.log(
      response.choices[0].message.content,
      tips.choices[0].message.content
    );


    const quoteJson = JSON.parse(response.choices[0].message.content || "");
    const tipJson = JSON.parse(tips.choices[0].message.content || "");
    console.log(quoteJson, tipJson);

    if (quoteJson && tipJson) {
      const newTip = await prisma.inspiration.create({
        data: {
          content: tipJson.tip || "",
          author: tipJson.author,
          category: tipJson.category,
          type: "Tip",
        },
      });

      const newQuote = await prisma.inspiration.create({
        data: {
          content: quoteJson.quote || "",
          author: quoteJson.author,
          category: quoteJson.category,
          type: "Quote",
        },
      });
    }

    

    return NextResponse.json({ quoteJson, tipJson }, { status: 201 });
  } catch (error) {
    console.error("[INSPIRATIONS_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
