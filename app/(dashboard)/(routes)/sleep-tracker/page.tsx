"use client";
import React, { useState, useEffect } from "react";
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
import { Progress } from "@/components/ui/progress";
import {
  MessageSquare,
  ZapIcon,
  BarChart2,
  CheckCircle,
  BookOpen,
  Droplet,
  Moon,
  Bed,
} from "lucide-react";
import Heading from "@/components/heading";

const Dashboard = () => {
  const [books, setBooks] = useState<any>([]);
  const [newBook, setNewBook] = useState<any>({
    title: "",
    author: "",
    startDate: "",
    endDate: "",
  });
  const [waterIntake, setWaterIntake] = useState<any>([]);
  const [sleepLog, setSleepLog] = useState<any>([]);
  const [sleepHours, setSleepHours] = useState<any>(0);
  const [moodLog, setMoodLog] = useState<any>([]);
  const [currentMood, setCurrentMood] = useState<any>(5);

  useEffect(() => {
    // Load data from localStorage on component mount
    const savedBooks = localStorage.getItem("books") || [];
    const savedWaterIntake = localStorage.getItem("waterIntake") || [];
    const savedSleepLog = localStorage.getItem("sleepLog") || "";
    const savedMoodLog = localStorage.getItem("moodLog") || [];

    setBooks(savedBooks);
    setWaterIntake(savedWaterIntake);
    setSleepLog([savedSleepLog]);
    setMoodLog(savedMoodLog);
  }, []);

  useEffect(() => {
    // Save data to localStorage whenever it changes
    localStorage.setItem("books", JSON.stringify(books));
    localStorage.setItem("waterIntake", JSON.stringify(waterIntake));
    localStorage.setItem("sleepLog", JSON.stringify(sleepLog));
    localStorage.setItem("moodLog", JSON.stringify(moodLog));
  }, [books, waterIntake, sleepLog, moodLog]);

  const handleAddBook = () => {
    if (newBook.title && newBook.author && newBook.startDate) {
      setBooks([...books, { ...newBook, id: Date.now() }]);
      setNewBook({ title: "", author: "", startDate: "", endDate: "" });
    }
  };

  const handleFinishBook = (id: any) => {
    setBooks(
      books.map((book: any) =>
        book.id === id
          ? { ...book, endDate: new Date().toISOString().split("T")[0] }
          : book
      )
    );
  };

  const handleWaterIntake = (amount: any) => {
    const today = new Date().toISOString().split("T")[0];
    const existingEntry = waterIntake.find(
      (entry: any) => entry.date === today
    );

    if (existingEntry) {
      setWaterIntake(
        waterIntake.map((entry: any) =>
          entry.date === today
            ? { ...entry, amount: entry.amount + amount }
            : entry
        )
      );
    } else {
      setWaterIntake([...waterIntake, { date: today, amount: amount }]);
    }
  };

  const handleSleepLog = () => {
    const today = new Date().toISOString().split("T")[0];
    setSleepLog([...sleepLog, { date: today, hours: sleepHours }]);
    setSleepHours(0);
  };

  const handleMoodLog = () => {
    const today = new Date().toISOString().split("T")[0];
    setMoodLog([...moodLog, { date: today, mood: currentMood }]);
    setCurrentMood(5); // Reset to middle value after logging
  };

  const getMonthMoodData = () => {
    const today = new Date();
    const oneMonthAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate()
    );
    return moodLog.filter((entry: any) => new Date(entry.date) >= oneMonthAgo);
  };

  return (
    <div className="min-h-screen dark:bg-black p-8">
      <Heading
        title="Sleep Tracker"
        description="Personal growth here."
        icon={Bed}
        iconColor="text-sky-500"
        bgColor="bg-sky-500/10"
      />

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8">
        {/* Sleep Tracker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Moon className="mr-2" />
              Sleep Tracker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              placeholder="Hours of sleep"
              className="mb-2"
            />
            <Button onClick={handleSleepLog} className="w-full mb-4">
              Log Sleep Hours
            </Button>
            <h3 className="font-semibold mb-2">Recent Sleep Log:</h3>
            <ul>
              {sleepLog.slice(-7).map((entry: any, index: any) => (
                <li key={index}>
                  {entry.date}: {entry.hours} hours
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
