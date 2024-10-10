'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Frown, Meh, MessageCirclePlus, Smile, SmileIcon } from 'lucide-react';
import Heading from '@/components/heading';

const ZenZoneMeditationLog = () => {
  const [meditationLogs, setMeditationLogs] = useState<any>([]);
  const [duration, setDuration] = useState('');
  const [reflection, setReflection] = useState('');
  const [mood, setMood] = useState('neutral');

  useEffect(() => {
    // Load meditation logs from localStorage
    const savedLogs = localStorage.getItem('meditationLogs') || "" || [];
    setMeditationLogs(savedLogs);
  }, []);

  const saveMeditationLog = () => {
    if (duration && reflection) {
      const newLog = {
        id: Date.now(),
        date: new Date().toISOString(),
        duration: parseInt(duration),
        reflection,
        mood
      };
      const updatedLogs = [newLog, ...meditationLogs];
      setMeditationLogs(updatedLogs);
      localStorage.setItem('meditationLogs', JSON.stringify(updatedLogs));
      setDuration('');
      setReflection('');
      setMood('neutral');
    }
  };

  return (
    <div className="min-h-screen dark:bg-black p-8">
      <Heading
        title="Zen Zone Meditation Log"
        description="Tracker your Meditation here."
        icon={SmileIcon}
        iconColor="text-sky-500"
        bgColor="bg-sky-500/10"
      />
    <div className="grid col-span-1 md:col-span-2 lg:col-span-3">
    <Card>
      <CardHeader>
        <CardTitle>Zen Zone Meditation Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Enter meditation duration"
            />
          </div>
          <div>
            <label htmlFor="reflection" className="block text-sm font-medium text-gray-700">Reflection</label>
            <Textarea
              id="reflection"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What did you meditate about? How do you feel?"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mood after meditation</label>
            <div className="flex space-x-4 mt-2">
              <Button
                variant={mood === 'bad' ? 'default' : 'outline'}
                onClick={() => setMood('bad')}
              >
                <Frown className="mr-2" /> Bad
              </Button>
              <Button
                variant={mood === 'neutral' ? 'default' : 'outline'}
                onClick={() => setMood('neutral')}
              >
                <Meh className="mr-2" /> Neutral
              </Button>
              <Button
                variant={mood === 'good' ? 'default' : 'outline'}
                onClick={() => setMood('good')}
              >
                <Smile className="mr-2" /> Good
              </Button>
            </div>
          </div>
          <Button onClick={saveMeditationLog}>Save Meditation Log</Button>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Recent Meditation Logs</h3>
          {meditationLogs.slice(0, 5).map((log:any) => (
            <div key={log.id} className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-500">{new Date(log.date).toLocaleString()}</p>
              <p className="font-medium">Duration: {log.duration} minutes</p>
              <p className="mt-2">{log.reflection}</p>
              <p className="mt-2">Mood: {log.mood}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
    </div>

    </div>
  );
};

export default ZenZoneMeditationLog;