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
import { BookAIcon, BookOpen } from "lucide-react";
import Heading from "@/components/heading";

const Dashboard = () => {
  const [books, setBooks] = useState<any>([]);
  const [newBook, setNewBook] = useState<any>({
    title: "",
    author: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    // Load data from localStorage on component mount
    const savedBooks = localStorage.getItem("books") || "";

    setBooks([savedBooks]);
  }, []);

  useEffect(() => {
    // Save data to localStorage whenever it changes
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

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

  return (
    <div className="min-h-screen dark:bg-black p-8">
      <Heading
        title="Book Tracker"
        description="Tracker your books here"
        icon={BookAIcon}
        iconColor="text-sky-500"
        bgColor="bg-sky-500/10"
      />
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8">
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
                onChange={(e) =>
                  setNewBook({ ...newBook, startDate: e.target.value })
                }
                className="mb-2"
              />
              <Button onClick={handleAddBook} className="w-full">
                Add Book
              </Button>
            </div>
            <ul>
              {books.map((book: any) => (
                <li key={book.id} className="mb-2">
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
      </div>
    </div>
  );
};

export default Dashboard;
