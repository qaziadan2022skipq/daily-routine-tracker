"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare } from "lucide-react";

const ImprovementAdvisor = () => {
  const [chatMessages, setChatMessages] = useState<any>([]);
  const [inputMessage, setInputMessage] = useState<any>("");
  const [improvementGoal, setImprovementGoal] = useState<any>("");
  const [chatState, setChatState] = useState<any>("initial");

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      setChatMessages([
        ...chatMessages,
        { text: inputMessage, sender: "user" },
      ]);
      setInputMessage("");

      setTimeout(() => {
        let botResponse;
        if (chatState === "initial" || chatState === "asking") {
          setImprovementGoal(inputMessage);
          botResponse = getImprovementAdvice(inputMessage);
          setChatState("advising");
        } else {
          botResponse =
            "Is there anything else you'd like to improve? If so, please let me know, and I'll provide advice on that topic.";
          setChatState("asking");
        }
        setChatMessages((prev: any) => [
          ...prev,
          { text: botResponse, sender: "bot" },
        ]);
      }, 1000);
    }
  };

  const getImprovementAdvice = (goal: any) => {
    switch (goal.toLowerCase()) {
      case "productivity":
        return "To improve productivity, try: 1) Use the Pomodoro Technique, 2) Prioritize tasks, 3) Minimize distractions, 4) Take regular breaks.";
      case "fitness":
        return "To improve fitness: 1) Set specific goals, 2) Create a balanced workout routine, 3) Stay consistent, 4) Pay attention to nutrition, 5) Get enough sleep.";
      case "learning":
        return "To enhance learning: 1) Use active recall, 2) Practice spaced repetition, 3) Teach others, 4) Apply knowledge practically, 5) Maintain a growth mindset.";
      default:
        return `To improve ${goal}, set specific goals, break them into smaller steps, work consistently, and seek feedback. Adjust your approach as needed.`;
    }
  };

  return (
    <div className="h-full bg-gray-100 p-4">
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8 h-full">
        {/* Improvement Advisor */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-1 min-h-screen">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2" />
              Improvement Advisor
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            <div className="min-h-screen overflow-y-auto mb-4 p-4 bg-gray-50 rounded">
              {chatMessages.length === 0 && (
                <p className="text-gray-500 italic">
                  Welcome! What would you like to improve today?
                </p>
              )}
              {chatMessages.map((msg: any, index: any) => (
                <div
                  key={index}
                  className={`mb-2 ${
                    msg.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block p-2 rounded ${
                      msg.sender === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
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
      </div>
    </div>
  );
};

export default ImprovementAdvisor;
