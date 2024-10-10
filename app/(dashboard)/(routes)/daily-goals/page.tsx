'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Moon, Droplet, Book, CheckSquare, Clock } from 'lucide-react';

const DailyGoals = () => {
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="mr-2" />
          Daily Goals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-start">
            <Moon className="mr-2 mt-1 text-blue-500" />
            <div>
              <h3 className="font-semibold">Sleep</h3>
              <p>Aim for 7-9 hours per night. Adults typically need this range for optimal health and cognitive function. Consistency in sleep schedule is also important.</p>
            </div>
          </div>
          <div className="flex items-start">
            <Clock className="mr-2 mt-1 text-purple-500" />
            <div>
              <h3 className="font-semibold">Meditation</h3>
              <p>Start with 5-10 minutes daily, gradually increasing to 15-20 minutes. Even short sessions can be beneficial. Consistency is more important than duration.</p>
            </div>
          </div>
          <div className="flex items-start">
            <Droplet className="mr-2 mt-1 text-blue-300" />
            <div>
              <h3 className="font-semibold">Water Intake</h3>
              <p>Aim for about 2-3 liters (8-12 cups) per day. This can vary based on activity level, climate, and individual needs. Monitor urine color for hydration status.</p>
            </div>
          </div>
          <div className="flex items-start">
            <Book className="mr-2 mt-1 text-green-500" />
            <div>
              <h3 className="font-semibold">Reading</h3>
              <p>Set a goal of 20-30 pages per day or 30 minutes of reading time. This helps build a consistent habit without being overwhelming. Adjust based on your schedule and reading speed.</p>
            </div>
          </div>
          <div className="flex items-start">
            <CheckSquare className="mr-2 mt-1 text-red-500" />
            <div>
              <h3 className="font-semibold">Daily Tasks</h3>
              <p>Aim for 3-5 important tasks per day. This helps maintain focus and avoid overwhelm. Prioritize these tasks and tackle them when your energy is highest.</p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">Remember, these are general guidelines. Adjust goals based on your personal needs, lifestyle, and any medical conditions. Consistency is key in forming habits.</p>
      </CardContent>
    </Card>
  );
};

export default DailyGoals;