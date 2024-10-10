'use client'

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { MessageSquare, ZapIcon, BarChart2, CheckCircle } from 'lucide-react';

// Define types for the state variables and props
type ChatMessage = {
  text: string;
  sender: 'user' | 'bot';
};

type Task = {
  text: string;
  completed: boolean;
  date: string;
};

type MeditationSession = {
  date: Date;
  duration: number;
};

type GrowthData = {
  name: string;
  progress: number;
  date: string;
};

type SelectedDay = {
  day: number;
  sessions: MeditationSession[];
};

const Dashboard: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');
  const [improvementGoal, setImprovementGoal] = useState<string>('');
  const [chatState, setChatState] = useState<'initial' | 'asking' | 'advising'>('initial');
  const [meditationTime, setMeditationTime] = useState<number>(0);
  const [isMeditating, setIsMeditating] = useState<boolean>(false);
  const [meditationSessions, setMeditationSessions] = useState<MeditationSession[]>([]);
  const [selectedDay, setSelectedDay] = useState<SelectedDay | null>(null);
  const [growthData, setGrowthData] = useState<GrowthData[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMeditating) {
      interval = setInterval(() => {
        setMeditationTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMeditating]);

  useEffect(() => {
    updateGrowthData();
  }, [tasks]);

  const updateGrowthData = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    const newGrowthData: GrowthData[] = [];
    for (let i = 0; i < daysInMonth; i++) {
      const date = new Date(startOfMonth);
      date.setDate(startOfMonth.getDate() + i);
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate.toDateString() === date.toDateString();
      });
      const completedTasks = dayTasks.filter(task => task.completed);
      const progress = dayTasks.length > 0 ? (completedTasks.length / dayTasks.length) * 100 : 0;

      newGrowthData.push({
        name: `Day ${i + 1}`,
        progress: progress,
        date: date.toISOString().split('T')[0],
      });
    }

    setGrowthData(newGrowthData);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      setChatMessages([...chatMessages, { text: inputMessage, sender: 'user' }]);
      setInputMessage('');

      setTimeout(() => {
        let botResponse;
        if (chatState === 'initial' || chatState === 'asking') {
          setImprovementGoal(inputMessage);
          botResponse = getImprovementAdvice(inputMessage);
          setChatState('advising');
        } else {
          botResponse = "Is there anything else you'd like to improve? If so, please let me know, and I'll provide advice on that topic.";
          setChatState('asking');
        }
        setChatMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
      }, 1000);
    }
  };

  const getImprovementAdvice = (goal: string): string => {
    switch (goal.toLowerCase()) {
      case 'productivity':
        return "To improve productivity, try: 1) Use the Pomodoro Technique, 2) Prioritize tasks, 3) Minimize distractions, 4) Take regular breaks.";
      case 'fitness':
        return "To improve fitness: 1) Set specific goals, 2) Create a balanced workout routine, 3) Stay consistent, 4) Pay attention to nutrition, 5) Get enough sleep.";
      case 'learning':
        return "To enhance learning: 1) Use active recall, 2) Practice spaced repetition, 3) Teach others, 4) Apply knowledge practically, 5) Maintain a growth mindset.";
      default:
        return `To improve ${goal}, set specific goals, break them into smaller steps, work consistently, and seek feedback. Adjust your approach as needed.`;
    }
  };

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, { text: newTask, completed: false, date: new Date().toISOString() }]);
      setNewTask('');
    }
  };

  const toggleTaskCompletion = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const startMeditation = () => {
    setIsMeditating(true);
    setMeditationTime(0);
  };

  const stopMeditation = () => {
    setIsMeditating(false);
    const newSession: MeditationSession = { date: new Date(), duration: meditationTime };
    setMeditationSessions([...meditationSessions, newSession]);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleDayClick = (day: number) => {
    const clickedDate = new Date();
    clickedDate.setDate(day);
    const sessionsOnDay = meditationSessions.filter(
      session => session.date.toDateString() === clickedDate.toDateString()
    );
    setSelectedDay({ day, sessions: sessionsOnDay });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Personal Growth Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Improvement Advisor */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2" />
              Improvement Advisor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 overflow-y-auto mb-4 p-4 bg-gray-50 rounded">
              {chatMessages.length === 0 && (
                <p className="text-gray-500 italic">Welcome! What would you like to improve today?</p>
              )}
              {chatMessages.map((msg, index) => (
                <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <span className={`inline-block p-2 rounded ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    {msg.text}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="mr-2"
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
            {improvementGoal && (
              <p className="text-sm text-gray-500 mt-2">
                Current focus: Improving {improvementGoal}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Zen Zone */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ZapIcon className="mr-2" />
              Zen Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Take a moment to meditate and center yourself.</p>
            {isMeditating ? (
              <div>
                <p className="text-2xl mb-4">Meditating: {formatTime(meditationTime)}</p>
                <Button onClick={stopMeditation} className="w-full">Stop Meditation</Button>
              </div>
            ) : (
              <Button onClick={startMeditation} className="w-full">Start Meditation</Button>
            )}
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Meditation Calendar</h3>
              <div className="grid grid-cols-7 gap-1">
                {[...Array(31)].map((_, index) => {
                  const day = index + 1;
                  const session = meditationSessions.find(s => new Date(s.date).getDate() === day);
                  return (
                    <div
                      key={day}
                      className={`p-2 text-center border cursor-pointer ${session ? 'bg-green-200' : 'bg-gray-100'} ${selectedDay?.day === day ? 'ring-2 ring-blue-500' : ''}`}
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
                    selectedDay.sessions.map((session, index) => (
                      <p key={index}>Session {index + 1}: {formatTime(session.duration)}</p>
                    ))
                  ) : (
                    <p>No meditation sessions on this day.</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Accountability Tracker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2" />
              Accountability Tracker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                className="mb-2"
              />
              <Button onClick={handleAddTask} className="w-full">Add Task</Button>
            </div>
            <ul>
              {tasks.map((task, index) => (
                <li key={index} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(index)}
                    className="mr-2"
                  />
                  <span className={task.completed ? 'line-through' : ''}>{task.text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Growth Chart */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart2 className="mr-2" />
              Growth Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-2 border">
                        <p>{`${payload[0].payload.date}`}</p>
                        <p>{payload && payload[0] ? `Progress: ${payload[0].value.toFixed(2)}%` : 'Progress: N/A'}</p>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Bar dataKey="progress" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4">
              <p className="mb-2">Overall Progress: {(growthData.reduce((sum, day) => sum + day.progress, 0) / growthData.length).toFixed(2)}%</p>
              <Progress value={growthData.reduce((sum, day) => sum + day.progress, 0) / growthData.length} className="w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
