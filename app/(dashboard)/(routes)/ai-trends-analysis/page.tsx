"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Brain } from "lucide-react";

const AIPoweredTrendAnalysis = () => {
  const trendData = [
    { name: "Week 1", productivity: 65, mood: 70, sleep: 75 },
    { name: "Week 2", productivity: 68, mood: 72, sleep: 73 },
    { name: "Week 3", productivity: 75, mood: 68, sleep: 80 },
    { name: "Week 4", productivity: 80, mood: 75, sleep: 82 },
    { name: "Week 5", productivity: 82, mood: 80, sleep: 85 },
    { name: "Week 6", productivity: 87, mood: 83, sleep: 87 },
  ];

  const insights = [
    "Your productivity has shown a consistent upward trend over the past 6 weeks.",
    "There's a strong correlation between your sleep quality and productivity levels.",
    "Your mood tends to improve following weeks of higher productivity.",
    "Consider focusing on sleep hygiene to potentially boost your overall well-being.",
  ];

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="mr-2" />
          AI-Powered Trend Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Your Growth Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="productivity"
                stroke="#8884d8"
                name="Productivity"
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#82ca9d"
                name="Mood"
              />
              <Line
                type="monotone"
                dataKey="sleep"
                stroke="#ffc658"
                name="Sleep Quality"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="font-semibold mb-2">AI-Generated Insights</h3>
          <ul className="list-disc pl-5 space-y-2">
            {insights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIPoweredTrendAnalysis;
