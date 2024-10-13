"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";

interface Event {
  id: string; // Assuming ID is a string for MongoDB
  title: string;
  type: string;
  date: string; // Format: 'YYYY-MM-DD'
  time: string; // Format: 'HH:mm'
  duration?: string; // Optional
  completed: boolean;
}

const CustomizableCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<Event>({
    id: "",
    title: "",
    type: "",
    date: selectedDate.toISOString().split("T")[0],
    time: "",
    duration: "",
    completed: false,
  });
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [customEventType, setCustomEventType] = useState("");
  const [calendarName, setCalendarName] = useState("My Calendar");
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD format
      try {
        const response = await axios.get("/api/events", {
          params: { date: formattedDate },
        });
        setEvents(response.data.events);
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };
    fetchEvents();
  }, [selectedDate]);

  const eventTypes = [
    { value: "task", label: "Task" },
    { value: "habit", label: "Habit" },
    { value: "meditation", label: "Meditation" },
    { value: "review", label: "Review" },
    { value: "goal", label: "Goal" },
    { value: "reading", label: "Reading" },
    { value: "supplement", label: "Supplement" },
    { value: "sleep", label: "Sleep" },
    { value: "exercise", label: "Exercise" },
    { value: "water", label: "Water Intake" },
    { value: "work", label: "Work" },
    { value: "meeting", label: "Meeting" },
    { value: "custom", label: "Custom" },
  ];

  const saveEvent = async () => {
    if (newEvent.title && newEvent.type && newEvent.time) {
      const eventToSave = {
        ...newEvent,
        date: selectedDate.toISOString().split("T")[0],
        type: newEvent.type === "custom" ? customEventType : newEvent.type,
      };

      try {
        const response = await axios.post("/api/events", eventToSave);
        setEvents((prev) => [...prev, response.data.event]);
        setNewEvent({
          id: "",
          title: "",
          type: "",
          date: selectedDate.toISOString().split("T")[0],
          time: "",
          duration: "",
          completed: false,
        });
        setCustomEventType("");
        setIsAddEventOpen(false);
      } catch (error) {
        console.error("Error saving event", error);
      }
    }
  };

  const toggleEventCompletion = async (index: number) => {
    const updatedEvents = events.map((event, i) =>
      i === index ? { ...event, completed: !event.completed } : event
    );

    setEvents(updatedEvents);

    try {
      const { id } = updatedEvents[index];
      await axios.put(`/api/events`, { ...updatedEvents[index] });
    } catch (error) {
      console.error("Error updating event completion", error);
    }
  };

  const deleteEvent = async (index: number) => {
    const {id} = events[index];
    console.log(id)
    try {
      await axios.delete(`/api/events`, { params: { id: id } });
      setEvents((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting event", error);
    }
  };

  const getDayEvents = (date: Date) => {
    return events.filter(
      (event) => event.date === date.toISOString().split("T")[0]
    );
  };

  const handleCalendarNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCalendarName(e.target.value);
  };

  const saveCalendarName = () => {
    localStorage.setItem("calendarName", calendarName);
    setIsEditingName(false);
  };

  return (
    <Card className="min-h-screen col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2 text-2xl">📅</span>
            {isEditingName ? (
              <div className="flex items-center">
                <Input
                  value={calendarName}
                  onChange={handleCalendarNameChange}
                  className="mr-2"
                />
                <Button onClick={saveCalendarName} size="sm">
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex items-center">
                <span className="mr-2">{calendarName}</span>
                <Button
                  onClick={() => setIsEditingName(true)}
                  size="sm"
                  variant="outline"
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <DialogTrigger asChild>
              <Button>
                <span className="mr-2">➕</span>
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  placeholder="Event Title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />
                <Select
                  value={newEvent.type}
                  onValueChange={(value) =>
                    setNewEvent({ ...newEvent, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {newEvent.type === "custom" && (
                  <Input
                    placeholder="Custom Event Type"
                    value={customEventType}
                    onChange={(e) => setCustomEventType(e.target.value)}
                  />
                )}
                <Input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, time: e.target.value })
                  }
                />
                <Input
                  placeholder="Duration (optional)"
                  value={newEvent.duration}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, duration: e.target.value })
                  }
                />
                <Button onClick={saveEvent}>Save Event</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onDayClick={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                hasEvents: (date) => getDayEvents(date).length > 0,
              }}
              modifiersClassNames={{
                hasEvents: "bg-blue-100 font-bold",
              }}
            />
          </div>
          <div>
            <h3 className="font-semibold mb-4">
              Events for {selectedDate.toDateString()}
            </h3>
            <div className="space-y-4">
              {getDayEvents(selectedDate).map((event, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-100 p-2 rounded"
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`event-${index}`}
                      checked={event.completed}
                      onCheckedChange={() => toggleEventCompletion(index)}
                    />
                    <div
                      className={
                        event.completed ? "line-through text-gray-500" : ""
                      }
                    >
                      <label
                        htmlFor={`event-${index}`}
                        className="font-medium cursor-pointer"
                      >
                        {event.title}
                      </label>
                      <p className="text-sm text-gray-600">
                        {event.type} - {event.time}{" "}
                        {event.duration && `(${event.duration})`}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteEvent(index)}
                  >
                    🗑️
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomizableCalendar;
