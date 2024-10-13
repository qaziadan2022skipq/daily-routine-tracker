import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

export const dynamic = "force-dynamic";

// export async function POST(request: Request) {
//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-4o",
//       messages: [
//         {
//           role: "user",
//           content: `
//                   You are a professional motivational speaker and you inspire people.
//                   Task: Give an inspirational quote so that they get motivated and make their daily routine good.
//                   Topic: Daily Life
//                   Audience: any
//                   Format: Text
//                   `,
//         },
//       ],
//     });
//     // Ensure response from OpenAI is valid
//     if (!response || !response.choices || response.choices.length === 0) {
//       return new NextResponse("No response from OpenAI", { status: 500 });
//     }

//     const tips = await openai.chat.completions.create({
//       model: "gpt-4o",
//       messages: [
//         {
//           role: "user",
//           content: `
//                   Your are a professional daily rotine  improvement advisor
//                   Task: Share some tips in paragraph with user so that they can imporve daily routine.
//                   Topic: Daily Life and improvement
//                   Audience: any
//                   Format: Text
//                   `,
//         },
//       ],
//     });
//     // Ensure response from OpenAI is valid
//     if (!tips || !tips.choices || tips.choices.length === 0) {
//       return new NextResponse("No response from OpenAI", { status: 500 });
//     }

//     console.log(response.choices[0].message.content);

//     const tip = tips.choices[0].message.content || "";
//     const quote = response.choices[0].message.content || "";

//     const newQuote = await prisma.inspiration.create({
//       data: {
//         content: quote,
//         author: "AI",
//         category: "motivation",
//         type: "quote",
//       },
//     });
//     const newTip = await prisma.inspiration.create({
//       data: {
//         content: tip,
//         author: "AI",
//         category: "motivation",
//         type: "tip",
//       },
//     });

//     console.log(newTip);

//     return NextResponse.json(
//       { inspiration: { newQuote, newTip } },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("[INSPIRATIONS_POST_ERROR]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }
