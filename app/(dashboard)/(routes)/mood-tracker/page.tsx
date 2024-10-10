'use client'
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
  SmilePlusIcon,
  SmilePlus,
} from "lucide-react";
import Heading from "@/components/heading";

const Dashboard = () => {
  const [moodLog, setMoodLog] = useState<any>([]);
  const [currentMood, setCurrentMood] = useState(5);

  useEffect(() => {
    // Load data from localStorage on component mount
   
    const savedMoodLog = localStorage.getItem("moodLog") || "";
    setMoodLog([savedMoodLog]);
  }, []);

  useEffect(() => {
    // Save data to localStorage whenever it changes
    localStorage.setItem("moodLog", JSON.stringify(moodLog));
  }, [ moodLog]);


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
    return moodLog.filter((entry:any) => new Date(entry.date) >= oneMonthAgo);
  };

  return (
    <div className="min-h-screen p-8 dark:bg-black">
      <Heading
        title="Mood Tracker"
        description="Tracker for your mood."
        icon={SmilePlus}
        iconColor="text-sky-500"
        bgColor="bg-sky-500/10"
      />

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8">
        {/* Mood Tracker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ZapIcon className="mr-2" />
              Mood Tracker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <input
                type="range"
                min="1"
                max="10"
                value={currentMood}
                onChange={(e) => setCurrentMood(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between px-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <span key={num} className="text-sm">
                    {num}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">Very Low</span>
              <span className="text-sm">Neutral</span>
              <span className="text-sm">Very High</span>
            </div>
            <p className="text-center mb-2">Current Mood: {currentMood}</p>
            <Button onClick={handleMoodLog} className="w-full mb-4">
              Log Mood
            </Button>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={getMonthMoodData()}>
                <XAxis dataKey="date" />
                <YAxis
                  domain={[1, 10]}
                  ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                />
                <Tooltip />
                <Line type="monotone" dataKey="mood" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
