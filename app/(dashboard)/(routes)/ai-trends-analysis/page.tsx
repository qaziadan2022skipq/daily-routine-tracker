"use client";

import React, { useEffect, useState } from "react";
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
import axios from "axios";

const AIPoweredTrendAnalysis = () => {
  const [trendData, setTrendData] = useState([]);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    const fetchTrendData = async () => {
      const response = await axios.get("/api/trends");
      const data = response.data;
      setTrendData(data.trendData);
      setInsights(data.insights);
    };

    fetchTrendData();
  }, []);

  return (
    <Card className="min-h-screen col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="mr-2" />
          AI-Powered Trend Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Your Growth Trends</h3>
          <ResponsiveContainer width="100%" height={500}>
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
              <Line
                type="monotone"
                dataKey="booksRead"
                stroke="#FF0000"
                name="Read Books"
              />
              <Line
                type="monotone"
                dataKey="meditationDuration"
                stroke="#00ff00"
                name="Meditation"
              />
              <Line
                type="monotone"
                dataKey="exerciseIntensity"
                stroke="#FFA500"
                name="Exercise Intensity"
              />
              <Line
                type="monotone"
                dataKey="dailyCognitive"
                stroke="#A020F0"
                name="Daily Cognitive"
              />
              <Line
                type="monotone"
                dataKey="dailyEnergy"
                stroke="#0000FF"
                name="Daily Energy"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="font-semibold mb-2">AI-Generated Insights</h3>
          <ul className="list-disc pl-5 space-y-2">
            {/* {insights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))} */}
            {
              insights && (<pre className="whitespace-pre font-serif">{insights}</pre>)
            }
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIPoweredTrendAnalysis;
