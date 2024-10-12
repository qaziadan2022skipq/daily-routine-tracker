import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { userId } = auth(); // Get userId from authentication
    if (!userId) {
      return new NextResponse("Unauthorized User", { status: 401 });
    }

    const exercises = await prisma.exercise.findMany({
      where: { userId },
    });
    return NextResponse.json({ exercises }, { status: 200 });
  } catch (error) {
    console.error("[EXERCISES_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth(); // Get userId from authentication
    if (!userId) {
      return new NextResponse("Unauthorized User", { status: 401 });
    }

    const body = await request.json();
    const { name, type, duration, intensity, weight } = body;

    if (!name || !type || !duration || !intensity || !weight) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const caloriesBurned = calculateCalories(duration, intensity, type, weight);
    const newExercise = await prisma.exercise.create({
      data: {
        name,
        type,
        duration,
        intensity,
        caloriesBurned,
        weight,
        userId,
        date: new Date(),
      },
    });

    return NextResponse.json({ exercise: newExercise }, { status: 201 });
  } catch (error) {
    console.error("[EXERCISES_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = auth(); // Get userId from authentication
    if (!userId) {
      return new NextResponse("Unauthorized User", { status: 401 });
    }

    const body = await request.json();
    const { exerciseId, updates } = body; // updates should include fields to be updated

    const exercise = await prisma.exercise.update({
      where: { id: exerciseId },
      data: updates,
    });

    return NextResponse.json({ exercise }, { status: 200 });
  } catch (error) {
    console.error("[EXERCISES_PUT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Helper function to calculate calories burned
const calculateCalories = (
  duration: number,
  intensity: string,
  type: string,
  weight: number
): number => {
  const intensityFactor: any = { easy: 0.8, medium: 1, hard: 1.2 };
  const weightInKg = parseFloat(weight.toString());

  let caloriesPerMinute: number;

  switch (type) {
    case "running":
      const baseCaloriesPerMinute = 124.7 / 10;
      caloriesPerMinute =
        baseCaloriesPerMinute *
        (weightInKg / 60) *
        (intensity === "hard"
          ? 1
          : intensityFactor[intensity] / intensityFactor.hard);
      break;
    case "weightlifting":
      caloriesPerMinute = 3 + intensityFactor[intensity] * 3;
      break;
    case "cycling":
      caloriesPerMinute = 7 + intensityFactor[intensity] * 8;
      break;
    case "yoga":
      caloriesPerMinute = 3 + intensityFactor[intensity] * 4;
      break;
    case "intense workout":
      caloriesPerMinute = 10 + intensityFactor[intensity] * 5;
      break;
    default:
      caloriesPerMinute = 5;
  }

  return Math.round(caloriesPerMinute * duration);
};
