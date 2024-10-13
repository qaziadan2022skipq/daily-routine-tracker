'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Plus, Clock, Trash } from "lucide-react";
import axios from 'axios';

interface JournalEntry {
    id: number;
    date: string; // ISO string format 'YYYY-MM-DD'
    content: string;
    timestamp: string; // ISO timestamp
}

const PrivateJournal: React.FC = () => {
  const [journalEntries, setJournalEntries] = useState<Record<string, JournalEntry[]>>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [entry, setEntry] = useState<string>('');
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      const date = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      try {
        const response = await axios.get(`/api/journal`, { params: { date: date } });
        const entries = response.data.entries;
        setJournalEntries(prev => ({
          ...prev,
          [date]: entries,
        }));
      } catch (error) {
        console.error("Error fetching journal entries", error);
      }
    };

    fetchEntries();
  }, [selectedDate]);

  useEffect(() => {
    setEntry('');
    setSelectedEntryId(null);
  }, [selectedDate]);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]; // Returns 'YYYY-MM-DD'
  };

  const formatDisplayDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const saveJournalEntry = async () => {
    if (entry.trim()) {
      const date = formatDate(selectedDate);
      const newEntry = {
        date: date,
        content: entry.trim(),
      };

      try {
        const response = await axios.post('/api/journal', newEntry);
        const savedEntry = response.data.entry;

        setJournalEntries(prev => ({
          ...prev,
          [date]: [...(prev[date] || []), savedEntry],
        }));
        setEntry('');
        setSelectedEntryId(savedEntry.id);
      } catch (error) {
        console.error("Error saving journal entry", error);
      }
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value));
  };

  const handleEntrySelect = (entryId: number) => {
    const formattedDate = formatDate(selectedDate);
    const selectedEntry = journalEntries[formattedDate]?.find(e => e.id === entryId);
    if (selectedEntry) {
      setEntry(selectedEntry.content);
      setSelectedEntryId(entryId);
    }
  };

  const handleNewEntry = () => {
    setEntry('');
    setSelectedEntryId(null);
  };

  const deleteJournalEntry = async (entryId: number) => {
    try {
      await axios.delete(`/api/journal`, {params: {id: entryId}});
      setJournalEntries(prev => {
        const date = formatDate(selectedDate);
        return {
          ...prev,
          [date]: prev[date].filter(entry => entry.id !== entryId),
        };
      });
      if (selectedEntryId === entryId) {
        setEntry('');
        setSelectedEntryId(null);
      }
    } catch (error) {
      console.error("Error deleting journal entry", error);
    }
  };

  const entriesForSelectedDate = journalEntries[formatDate(selectedDate)] || [];

  return (
    <Card className="min-h-screen">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2" />
          Private Journal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="journalDate" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <Input
            id="journalDate"
            type="date"
            value={formatDate(selectedDate)}
            onChange={handleDateChange}
            className="w-full"
          />
        </div>
        <div>
          <label htmlFor="journalEntry" className="block text-sm font-medium text-gray-700 mb-1">Your Private Thoughts</label>
          <Textarea
            id="journalEntry"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="Express yourself freely. This is your private space to reflect, dream, and grow."
            rows={10}
            className="w-full"
          />
        </div>
        <div className="flex justify-between">
          <Button onClick={handleNewEntry} className="flex items-center">
            <Plus className="mr-2" size={16} />
            New Entry
          </Button>
          <Button onClick={saveJournalEntry}>Save Entry</Button>
        </div>
        {entriesForSelectedDate.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Entries for {formatDisplayDate(selectedDate)}:</h3>
            <ul className="space-y-2">
              {entriesForSelectedDate.map((entry) => (
                <li key={entry.id} className="flex justify-between items-center">
                  <Button
                    variant="ghost"
                    className={`text-left flex items-center w-full justify-between p-2 rounded-md ${selectedEntryId === entry.id ? 'bg-gray-100' : ''}`}
                    onClick={() => handleEntrySelect(entry.id)}
                  >
                    <span className="flex items-center">
                      <Clock className="mr-2" size={16} />
                      Jornal written at {formatTime(entry.date)}
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="ml-2"
                    onClick={() => deleteJournalEntry(entry.id)}
                  >
                    <Trash size={16} />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PrivateJournal;
