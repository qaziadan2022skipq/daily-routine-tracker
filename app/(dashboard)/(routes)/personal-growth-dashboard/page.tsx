"use client";

import React, { useState, useEffect } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Droplet, BookOpen, ZapIcon, Moon } from "lucide-react";
import axios from "axios";

const PersonalGrowthDashboard: React.FC = () => {
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
    fetchBooks();
    fetchWaterIntake();
    fetchSleepLog();
    fetchMoodLog();
  }, []);

  const fetchBooks = async () => {
    const response = await fetch(`/api/book`);
    const data = await response.json();
    console.log(data);
    setBooks(data.books);
  };

  const fetchWaterIntake = async () => {
    const response = await axios.get(`/api/water-intake`);
    const data = response.data.waterIntake;
    setWaterIntake(data);
  };

  const fetchSleepLog = async () => {
    const response = await axios.get(`/api/sleep-log`);
    const data = response.data.sleepLog;
    setSleepLog(data);
  };

  const fetchMoodLog = async () => {
    const response = await axios.get(`/api/mood-log`);
    const data = response.data.moodLog;
    setMoodLog(data);
  };

  const handleAddBook = async () => {
    if (newBook.title && newBook.author && newBook.startDate) {
      const response = await fetch(`/api/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook),
      });
      const addedBook = await response.json();
      setBooks([...books, addedBook]);
      setNewBook({ title: "", author: "", startDate: "", endDate: "" });
    }
  };

  const handleFinishBook = async (id: string) => {
    const endDate = new Date().toISOString().split("T")[0];
    const response = await axios.put(`/api/book`, {
      endDate: endDate,
      bookId: id,
    });
    const updatedBook = response.data.book;
    setBooks(books.map((book: any) => (book.id === id ? updatedBook : book)));
  };

  const handleWaterIntake = async (amount: number) => {
    const today = new Date().toISOString().split("T")[0];
    const response = await axios.post(`/api/water-intake`, {
      date: today,
      amount,
    });
    const newIntake = response.data.intake;
    setWaterIntake([...waterIntake, newIntake]);
  };

  const handleSleepLog = async () => {
    const today = new Date().toISOString().split("T")[0];
    const response = await axios.post(`/api/sleep-log`, {
      date: today,
      hours: sleepHours,
    });
    const newLog = response.data.log;
    setSleepLog([...sleepLog, newLog]);
    setSleepHours(0);
  };

  const handleMoodLog = async () => {
    const today = new Date().toISOString().split("T")[0];
    const response = await axios.post(`/api/mood-log`, {
      date: today,
      mood: currentMood,
    });
    const newMood = response.data.moodEntry;
    setMoodLog([...moodLog, newMood]);
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
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Personal Growth Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Book Tracker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2" />
              Book Tracker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                value={newBook.title}
                onChange={(e) =>
                  setNewBook({ ...newBook, title: e.target.value })
                }
                placeholder="Book title"
                className="mb-2"
              />
              <Input
                value={newBook.author}
                onChange={(e) =>
                  setNewBook({ ...newBook, author: e.target.value })
                }
                placeholder="Author"
                className="mb-2"
              />
              <Input
                type="date"
                value={newBook.startDate}
                onChange={(e) => {
                  setNewBook({ ...newBook, startDate: e.target.value });
                  console.log(e.target.value);
                }}
                className="mb-2"
              />
              <Button onClick={handleAddBook} className="w-full">
                Add Book
              </Button>
            </div>
            <ul>
              {books.map((book: any) => (
                <li key={book._id} className="mb-2">
                  <span>
                    {book.title} by {book.author} - Started: {book.startDate}
                  </span>
                  {!book.endDate && (
                    <Button
                      onClick={() => handleFinishBook(book.id)}
                      className="ml-2"
                      size="sm"
                    >
                      Finish
                    </Button>
                  )}
                  {book.endDate && <span> - Finished: {book.endDate}</span>}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Water Intake Tracker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Droplet className="mr-2" />
              Water Intake
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-around mb-4">
              <Button onClick={() => handleWaterIntake(250)}>250ml</Button>
              <Button onClick={() => handleWaterIntake(500)}>500ml</Button>
              <Button onClick={() => handleWaterIntake(1000)}>1L</Button>
            </div>
            <h3 className="font-semibold mb-2">Recent Water Intake:</h3>
            <ul>
              {waterIntake.slice(-7).map((entry: any, index: number) => (
                <li key={index}>
                  {entry.date}: {entry.amount} ml
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

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
              {sleepLog.slice(-7).map((entry: any, index: number) => (
                <li key={index}>
                  {entry.date}: {entry.hours} hours
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

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

export default PersonalGrowthDashboard;
