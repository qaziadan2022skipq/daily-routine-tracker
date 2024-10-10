"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dumbbell, TrendingUp, Calendar, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ExerciseTracker = () => {
  const [exercises, setExercises] = useState<any>([]);
  const [newExercise, setNewExercise] = useState<any>("");
  const [exerciseType, setExerciseType] = useState<any>("running");
  const [duration, setDuration] = useState<any>("");
  const [intensity, setIntensity] = useState<any>("medium");
  const [weight, setWeight] = useState<any>("");
  const [monthlyExerciseData, setMonthlyExerciseData] = useState<any>([]);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [advice, setAdvice] = useState<any>("");

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    if (exercises.length > 0) {
      updateMonthlyExerciseData();
      generateAdvice();
    }
  }, [exercises]);

  const fetchExercises = async () => {
    try {
      const response = await axios.get("/api/exercises"); // Adjust the endpoint as needed
      setExercises(response.data.exercises);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const updateMonthlyExerciseData = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const daysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();

    const newMonthlyData = [];
    for (let i = 0; i < daysInMonth; i++) {
      const date = new Date(startOfMonth);
      date.setDate(startOfMonth.getDate() + i);
      const dayExercises = exercises.filter((exercise: any) => {
        const exerciseDate = new Date(exercise.date);
        return exerciseDate.toDateString() === date.toDateString();
      });

      const totalDuration = dayExercises.reduce(
        (sum: any, exercise: any) => sum + exercise.duration,
        0
      );
      const totalCalories = dayExercises.reduce(
        (sum: any, exercise: any) => sum + exercise.caloriesBurned,
        0
      );

      newMonthlyData.push({
        name: `Day ${i + 1}`,
        date: date.toISOString().split("T")[0],
        duration: totalDuration,
        calories: totalCalories,
      });
    }

    setMonthlyExerciseData(newMonthlyData);
  };

  const generateAdvice = () => {
    const today = new Date().toDateString();
    const todayExercises = exercises.filter(
      (exercise: any) => new Date(exercise.date).toDateString() === today
    );
    const todayTotalDuration = todayExercises.reduce(
      (sum: any, exercise: any) => sum + exercise.duration,
      0
    );

    if (todayTotalDuration >= 30) {
      setAdvice(
        `Great job! You've met your 30-minute exercise goal today. Keep up the good work!`
      );
    } else if (todayTotalDuration > 0) {
      const remaining = 30 - todayTotalDuration;
      setAdvice(
        `You're on the right track! Just ${remaining} more minutes of exercise today to reach your 30-minute goal.`
      );
    } else {
      setAdvice(
        `Don't forget to exercise today! Aim for at least 30 minutes of physical activity.`
      );
    }
  };

  const calculateCalories = (
    duration: any,
    intensity: any,
    type: any,
    weight: any
  ) => {
    const intensityFactor: any = { easy: 0.8, medium: 1, hard: 1.2 };
    const weightInKg = parseFloat(weight);

    let caloriesPerMinute;
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

  const handleAddExercise = async () => {
    if (newExercise.trim() !== "" && duration !== "" && weight !== "") {
      const caloriesBurned = calculateCalories(
        parseInt(duration),
        intensity,
        exerciseType,
        parseFloat(weight)
      );
      const newExerciseEntry = {
        name: newExercise,
        type: exerciseType,
        duration: parseInt(duration),
        intensity,
        weight: parseFloat(weight),
        caloriesBurned,
        date: new Date().toISOString(),
      };

      try {
        const response = await axios.post("/api/exercises", newExerciseEntry);
        setExercises((prevExercises: any) => [
          ...prevExercises,
          response.data.exercise,
        ]);
        setNewExercise("");
        setDuration("");
        setWeight("");
      } catch (error) {
        console.error("Error adding exercise:", error);
      }
    }
  };

  const getTotalCaloriesBurned = () => {
    return exercises.reduce(
      (total: any, exercise: any) => total + exercise.caloriesBurned,
      0
    );
  };

  const getTotalDuration = () => {
    return exercises.reduce(
      (total: any, exercise: any) => total + exercise.duration,
      0
    );
  };

  const handleExerciseClick = (exercise: any) => {
    setSelectedExercise(exercise);
  };

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Dumbbell className="mr-2" />
          Exercise Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="exercise-name">Exercise Name</Label>
            <Input
              id="exercise-name"
              value={newExercise}
              onChange={(e) => setNewExercise(e.target.value)}
              placeholder="e.g., Morning Run, Yoga Session"
              className="mb-2"
            />
            <Label htmlFor="exercise-type">Exercise Type</Label>
            <Select
              //   id="exercise-type"
              value={exerciseType}
              onValueChange={setExerciseType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select exercise type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="weightlifting">Weightlifting</SelectItem>
                <SelectItem value="cycling">Cycling</SelectItem>
                <SelectItem value="yoga">Yoga</SelectItem>
                <SelectItem value="intense workout">Intense Workout</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="exercise-duration">Duration (minutes)</Label>
            <Input
              id="exercise-duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Enter duration"
              className="mb-2"
            />
            <Label htmlFor="exercise-intensity">Intensity</Label>
            <Select
              //   id="exercise-intensity"
              value={intensity}
              onValueChange={setIntensity}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select intensity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mb-4">
          <Label htmlFor="user-weight">Weight (kg)</Label>
          <Input
            id="user-weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter your weight in kg"
            className="mb-2"
          />
        </div>
        <Button onClick={handleAddExercise} className="w-full mb-4">
          Add Exercise
        </Button>

        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Daily Exercise Advice</AlertTitle>
          <AlertDescription>{advice}</AlertDescription>
        </Alert>

        <div className="flex justify-between mb-4">
          <h4>Total Calories Burned: {getTotalCaloriesBurned()} kcal</h4>
          <h4>Total Duration: {getTotalDuration()} minutes</h4>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyExerciseData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="calories" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyExerciseData}>
            <Line type="monotone" dataKey="duration" stroke="#82ca9d" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ExerciseTracker;
