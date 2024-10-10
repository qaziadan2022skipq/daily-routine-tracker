"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ClipboardCheck, ClipboardList, Trash2 } from "lucide-react";
import React, { useState } from "react";

const page = () => {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<{ text: string; isCompleted: boolean }[]>(
    []
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setTasks([...tasks, { text: input, isCompleted: false }]);
      setInput("");
    }
  };

  const toggleTaskCompletion = (index: number) => {
    setTasks(
      tasks.map((task, i) =>
        i === index ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const deleteTask = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8">
      <Card className="min-h-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <ClipboardList className="mr-2" />
            Task manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <form
              onSubmit={handleSend}
              className="flex p-2 border-b border-gray-300"
            >
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Write a task..."
                className="flex-1"
              />
              <Button type="submit" className="ml-2">
                Send
              </Button>
            </form>

            <div className="w-full pt-4">
              {tasks.map((task, index) => (
                <div
                  key={index}
                  className={`flex justify-between p-3 mb-2 w-full border border-gray-200 rounded-lg ${
                    task.isCompleted ? "bg-green-200" : "bg-blue-200"
                  }`}
                  onClick={() => toggleTaskCompletion(index)}
                >
                  <p>{task.text}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTaskCompletion(index);
                      }}
                    >
                      <ClipboardCheck color="green" />
                    </button>
                    <button onClick={(e) => deleteTask(e, index)}>
                      <Trash2 color="red" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
