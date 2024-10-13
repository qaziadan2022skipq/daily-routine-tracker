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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { MessageSquare, ZapIcon, BarChart2, CheckCircle } from "lucide-react";
import axios from "axios";

const Dashboard = () => {
  const [tasks, setTasks] = useState<any>([]);
  const [newTask, setNewTask] = useState<any>("");
  const [meditationTime, setMeditationTime] = useState<any>(0);
  const [isMeditating, setIsMeditating] = useState<any>(false);
  const [meditationSessions, setMeditationSessions] = useState<any>([]);
  const [growthData, setGrowthData] = useState<any>([]);
  const [selectedDay, setSelectedDay] = useState<any | null>(null);
  const [daySessions, setDaySessions] = useState<any[]>([]);

  useEffect(() => {
    fetchTasks();
    fetchMeditationSessions();
  }, []);

  useEffect(() => {
    let interval: any;
    if (isMeditating) {
      interval = setInterval(() => {
        setMeditationTime((prevTime: any) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMeditating]);

  const handleDayClick = (day: number) => {
    console.log(growthData);
    const sessionsForDay = meditationSessions.filter(
      (session: any) => new Date(session.date).getDate() === day
    );
    setSelectedDay({ day, sessions: sessionsForDay });
    setDaySessions(sessionsForDay);
  };

  const fetchTasks = async () => {
    const response = await fetch("/api/task");
    const data = await response.json();
    setTasks(data.tasks);
    updateGrowthData(data.tasks, meditationSessions);
  };

  const fetchMeditationSessions = async () => {
    const response = await fetch("/api/meditation-sessions");
    const data = await response.json();
    setMeditationSessions(data.sessions);
    updateGrowthData(tasks, data.sessions);
  };

  const updateGrowthData = (tasks: any, sessions: any) => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const growthMap = new Map();

    // Function to add or update growth data
    const addOrUpdateGrowthData = (
      date: string,
      completedTasks: number,
      meditationDuration: number
    ) => {
      if (growthMap.has(date)) {
        const existingData = growthMap.get(date);
        existingData.progressTasks += completedTasks; // Update completed tasks
        existingData.progressMeditation += meditationDuration; // Update meditation duration
      } else {
        growthMap.set(date, {
          name: date,
          progressTasks: completedTasks,
          progressMeditation: meditationDuration,
        });
      }
    };

    // Calculate today's completed tasks
    const completedTasksToday = tasks.filter((task: any) => {
      const taskDate = new Date(task.date).toISOString().split("T")[0]; // Ensure task.date is in the correct format
      return task.completed && taskDate === today;
    }).length;

    // Calculate today's meditation duration
    const totalMeditationDurationToday = sessions.reduce(
      (acc: number, session: any) => {
        const sessionDate = new Date(session.date).toISOString().split("T")[0];
        return sessionDate === today ? acc + session.duration : acc;
      },
      0
    );

    // Update today's growth data
    addOrUpdateGrowthData(
      today,
      completedTasksToday,
      totalMeditationDurationToday
    );

    // Process past meditation sessions
    sessions.forEach((session: any) => {
      const sessionDate = new Date(session.date).toISOString().split("T")[0];
      if (sessionDate !== today) {
        addOrUpdateGrowthData(sessionDate, 0, session.duration); // Add meditation data for past session dates
      }
    });

    // Process past tasks
    tasks.forEach((task: any) => {
      const taskDate = new Date(task.date).toISOString().split("T")[0]; // Ensure task.date is in the right format
      if (taskDate !== today) {
        const isTaskCompleted = task.completed ? 1 : 0;
        addOrUpdateGrowthData(taskDate, isTaskCompleted, 0); // Add task data for past task dates
      }
    });

    // Convert the map back to an array and update state
    const updatedGrowthData = Array.from(growthMap.values());
    setGrowthData(updatedGrowthData);
  };

  const handleAddTask = async () => {
    if (newTask.trim() !== "") {
      const response = await axios.post("/api/task", { text: newTask });
      const data = response.data.task;
      setTasks([...tasks, data]);
      setNewTask("");
      updateGrowthData([...tasks, data], meditationSessions);
    }
  };

  const toggleTaskCompletion = async (index: any) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;

    await fetch(`/api/task`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskId: updatedTasks[index].id,
        completed: updatedTasks[index].completed,
      }),
    });
    setTasks(updatedTasks);
    updateGrowthData(updatedTasks, meditationSessions);
  };

  const startMeditation = () => {
    setIsMeditating(true);
    setMeditationTime(0);
  };

  const stopMeditation = async () => {
    setIsMeditating(false);
    const newSession = { date: new Date(), duration: meditationTime };
    const endDate = new Date().toISOString().split("T")[0];
    const response = await fetch("/api/meditation-sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ duration: meditationTime, date: endDate }),
    });

    const data = await response.json();
    setMeditationSessions([...meditationSessions, data.session]);
    updateGrowthData(tasks, [...meditationSessions, data.session]);
  };

  const formatTime = (seconds: any) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl text-primary font-bold mb-8 text-center">
        Progress Achievements Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Zen Zone */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ZapIcon className="mr-2" />
              Zen Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Meditation Time: {formatTime(meditationTime)}
            </p>
            {isMeditating ? (
              <Button
                onClick={stopMeditation}
                variant="destructive"
                className="w-full"
              >
                Stop Meditation
              </Button>
            ) : (
              <Button onClick={startMeditation} className="w-full">
                Start Meditation
              </Button>
            )}

            <div id="work" className="mt-4">
              <h3 className="text-lg font-semibold mb-2">
                Meditation Calendar
              </h3>
              <div className="grid grid-cols-7 gap-1">
                {[...Array(31)].map((_, index) => {
                  const day = index + 1;
                  const session = meditationSessions.find(
                    (s: any) => new Date(s.date).getDate() === day
                  );
                  return (
                    <div
                      key={day}
                      className={`p-2 text-center border cursor-pointer ${
                        session ? "bg-green-200" : "bg-gray-100"
                      } ${
                        selectedDay?.day === day ? "ring-2 ring-blue-500" : ""
                      }`}
                      onClick={() => handleDayClick(day)}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
              {selectedDay && (
                <div className="mt-4">
                  <h4>Meditation on Day {selectedDay.day}:</h4>
                  {selectedDay.sessions.length > 0 ? (
                    selectedDay.sessions.map((session: any, index: any) => (
                      <p key={index}>
                        Session {index + 1}: {formatTime(session.duration)}
                      </p>
                    ))
                  ) : (
                    <p>No meditation sessions on this day.</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Task Tracker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart2 className="mr-2" />
              Task Tracker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                className="mr-2"
              />
              <Button onClick={handleAddTask}>Add Task</Button>
            </div>
            <ul>
              {tasks.map((task: any, index: any) => (
                <li
                  key={task.id}
                  className="flex justify-between items-center mb-2"
                >
                  <span
                    className={`cursor-pointer ${
                      task.completed ? "line-through text-gray-400" : ""
                    }`}
                    onClick={() => toggleTaskCompletion(index)}
                  >
                    {task.text}
                  </span>
                  {task.completed && <CheckCircle className="text-green-500" />}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Growth Chart */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Growth Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="progressTasks"
                fill="#8884d8"
                name="Completed Tasks"
              />
              <Bar
                dataKey="progressMeditation"
                fill="#82ca9d"
                name="Meditation Duration (s)"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
