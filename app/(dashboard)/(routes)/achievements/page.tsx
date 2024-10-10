"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Target,
  Book,
  Droplet,
  Moon,
  Zap,
  Leaf,
  Brain,
  PenTool,
  Star,
  Lock,
  Unlock,
} from "lucide-react";

const EnhancedProgressAchievements = () => {
  const achievements = [
    {
      icon: <Trophy className="w-6 h-6 text-yellow-500" />,
      title: "30-Day Streak",
      description: "Maintained a habit for 30 consecutive days",
    },
    {
      icon: <Target className="w-6 h-6 text-green-500" />,
      title: "Goal Crusher",
      description: "Completed 5 personal goals",
    },
    {
      icon: <Book className="w-6 h-6 text-blue-500" />,
      title: "Bookworm",
      description: "Read 10 books this year",
    },
    {
      icon: <Droplet className="w-6 h-6 text-blue-300" />,
      title: "Hydration Hero",
      description: "Met water intake goal for 2 weeks straight",
    },
    {
      icon: <Moon className="w-6 h-6 text-purple-500" />,
      title: "Sleep Master",
      description: "Achieved optimal sleep duration for a month",
    },
    {
      icon: <Zap className="w-6 h-6 text-orange-500" />,
      title: "Productivity Powerhouse",
      description: "Completed all daily tasks for a week",
    },
    {
      icon: <Leaf className="w-6 h-6 text-green-400" />,
      title: "Zen Master",
      description: "Meditated for 7 days in a row",
    },
    {
      icon: <Brain className="w-6 h-6 text-pink-500" />,
      title: "Mindfulness Guru",
      description: "Completed 30 meditation sessions",
    },
    {
      icon: <PenTool className="w-6 h-6 text-indigo-500" />,
      title: "Reflection Pro",
      description: "Completed 10 weekly reviews",
    },
    {
      icon: <Star className="w-6 h-6 text-red-500" />,
      title: "Growth Champion",
      description: "Improved in all areas for 3 consecutive months",
    },
  ];

  const medals = [
    {
      icon: <Trophy className="w-4 h-4" />,
      title: "7-Day Meditation Streak",
      unlocked: true,
    },
    {
      icon: <Trophy className="w-4 h-4" />,
      title: "30-Day Mood Logging Streak",
      unlocked: true,
    },
    {
      icon: <Trophy className="w-4 h-4" />,
      title: "Completed 5 Monthly Reviews",
      unlocked: true,
    },
    {
      icon: <Trophy className="w-4 h-4" />,
      title: "Read 5 Self-Improvement Books",
      unlocked: true,
    },
    {
      icon: <Trophy className="w-4 h-4" />,
      title: "Achieved 10 Personal Goals",
      unlocked: true,
    },
    {
      icon: <Trophy className="w-4 h-4" />,
      title: "30-Day Meditation Streak",
      unlocked: false,
    },
    {
      icon: <Trophy className="w-4 h-4" />,
      title: "100-Day Habit Streak",
      unlocked: false,
    },
    {
      icon: <Trophy className="w-4 h-4" />,
      title: "Completed 20 Weekly Reviews",
      unlocked: false,
    },
    {
      icon: <Trophy className="w-4 h-4" />,
      title: "Read 20 Books in a Year",
      unlocked: false,
    },
    {
      icon: <Trophy className="w-4 h-4" />,
      title: "6 Months of Consistent Growth",
      unlocked: false,
    },
    {
      icon: <Trophy className="w-4 h-4" />,
      title: "Achieved 50 Personal Goals",
      unlocked: false,
    },
    {
      icon: <Trophy className="w-4 h-4" />,
      title: "365-Day App Usage Streak",
      unlocked: false,
    },
    {
      icon: <Trophy className="w-4 h-4" />,
      title: "Mindfulness Master (100 meditation sessions)",
      unlocked: false,
    },
    {
      icon: <Trophy className="w-4 h-4" />,
      title: "Sleep Schedule Perfectionist (30 days)",
      unlocked: false,
    },
    {
      icon: <Trophy className="w-4 h-4" />,
      title: "Hydration Champion (60 days goal)",
      unlocked: false,
    },
  ];

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="mr-2" />
          Your Achievements and Medals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow flex items-center space-x-4"
            >
              <div className="flex-shrink-0">{achievement.icon}</div>
              <div>
                <h3 className="font-semibold">{achievement.title}</h3>
                <p className="text-sm text-gray-600">
                  {achievement.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Recent Milestones</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">100 Days Active</Badge>
            <Badge variant="secondary">25 Books Read</Badge>
            <Badge variant="secondary">50 Meditation Sessions</Badge>
            <Badge variant="secondary">10 Goals Achieved</Badge>
            <Badge variant="secondary">20 Weekly Reviews</Badge>
            <Badge variant="secondary">5 Months of Consistent Growth</Badge>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Medals Gallery</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {medals.map((medal, index) => (
              <div
                key={index}
                className={`flex items-center p-2 rounded-full ${
                  medal.unlocked ? "bg-yellow-100" : "bg-gray-100"
                }`}
              >
                <div className="relative">
                  {medal.icon}
                  {medal.unlocked ? (
                    <Unlock className="w-3 h-3 text-green-500 absolute -top-1 -right-1" />
                  ) : (
                    <Lock className="w-3 h-3 text-gray-500 absolute -top-1 -right-1" />
                  )}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    medal.unlocked ? "text-gray-800" : "text-gray-500"
                  }`}
                >
                  {medal.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedProgressAchievements;
