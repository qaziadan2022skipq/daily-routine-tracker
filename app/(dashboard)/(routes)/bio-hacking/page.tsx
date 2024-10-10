"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Brain, Zap, Droplet, Trash2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Supplement {
  id: string;
  name: string;
  dosage: string; // e.g., "500mg"
  time: string; // e.g., "8:00 AM"
}

interface DailyLog {
  date: string; // ISO format date, e.g., "2023-10-08"
  cognitive: number; // 0-100 scale
  energy: number; // 0-100 scale
  hydration: number; // 0-100 scale
  supplements: Record<string, boolean>; // e.g., { "Vitamin D": true, "Omega-3": false }
}

const BiohackingDashboard: React.FC = () => {
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [newSupplement, setNewSupplement] = useState<Supplement>({
    id: "",
    name: "",
    dosage: "",
    time: "",
  });
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [currentLog, setCurrentLog] = useState<DailyLog>({
    date: new Date().toISOString().split("T")[0],
    cognitive: 75,
    energy: 80,
    hydration: 70,
    supplements: {},
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [supplementsResponse, logsResponse] = await Promise.all([
          axios.get("/api/supplements"),
          axios.get("/api/daily-logs"),
        ]);

        setSupplements(supplementsResponse.data.supplements);
        setDailyLogs(logsResponse.data.dailyLogs);

        const today = new Date().toISOString().split("T")[0];
        const mostRecentLog =
          logsResponse.data[logsResponse.data.length - 1] || currentLog;

        // Update current log
        setCurrentLog({
          ...currentLog,
          date: mostRecentLog.date !== today ? today : mostRecentLog.date,
          cognitive: mostRecentLog.cognitive,
          energy: mostRecentLog.energy,
          hydration: mostRecentLog.hydration,
          supplements: supplementsResponse.data.reduce(
            (acc: Record<string, boolean>, supp: Supplement) => {
              acc[supp.name] = mostRecentLog.supplements[supp.name] || false;
              return acc;
            },
            {}
          ),
        });
      } catch (error) {
        console.error("[LOAD_INITIAL_DATA_ERROR]", error);
      }
    };

    loadInitialData();
  }, []);

  const handleSupplementChange = (supplementName: string) => {
    setCurrentLog((prevLog) => ({
      ...prevLog,
      supplements: {
        ...prevLog.supplements,
        [supplementName]: !prevLog.supplements[supplementName],
      },
    }));
  };

  const handleSliderChange = (field: keyof DailyLog, value: number) => {
    setCurrentLog((prevLog) => ({ ...prevLog, [field]: value }));
  };

  const handleAddSupplement = async () => {
    if (newSupplement.name && newSupplement.dosage && newSupplement.time) {
      try {
        await axios.post("/api/supplements", newSupplement);
        setSupplements((prev) => [...prev, newSupplement]);
        setNewSupplement({ id: "", name: "", dosage: "", time: "" });
      } catch (error) {
        console.error("[ADD_SUPPLEMENT_ERROR]", error);
      }
    } else {
      console.warn("Please fill out all supplement fields.");
    }
  };

  const handleDeleteSupplement = async (supplementId: string) => {
    try {
      await axios.delete(`/api/supplements`, { params: { id: supplementId } });
      setSupplements((prev) => prev.filter((s) => s.name !== supplementId));
      handleSupplementChange(supplementId);
    } catch (error) {
      console.error("[DELETE_SUPPLEMENT_ERROR]", error);
    }
  };

  const handleSaveCurrentLog = async () => {
    try {
      await axios.post("/api/daily-logs", currentLog);
      setDailyLogs((prevLogs) => {
        const updatedLogs = [
          ...prevLogs.filter((log) => log.date !== currentLog.date),
          currentLog,
        ];
        return updatedLogs.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      });

      // Reset current log for the next day
      const nextDate = new Date(currentLog.date);
      nextDate.setDate(nextDate.getDate() + 1);
      setCurrentLog({
        date: nextDate.toISOString().split("T")[0],
        cognitive: 75, // reset or retain previous value as needed
        energy: 80,
        hydration: 70,
        supplements: {},
      });
    } catch (error) {
      console.error("[SAVE_LOG_ERROR]", error);
    }
  };

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="mr-2" />
          Biohacking Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Daily Metrics</h3>
            <div className="space-y-4">
              <Input
                type="date"
                value={currentLog.date}
                onChange={(e) =>
                  setCurrentLog({ ...currentLog, date: e.target.value })
                }
              />
              <div>
                <label className="flex items-center">
                  <Brain className="mr-2" /> Cognitive Performance
                </label>
                <Slider
                  value={[currentLog.cognitive]}
                  onValueChange={(value) =>
                    handleSliderChange("cognitive", value[0])
                  }
                  max={100}
                  step={1}
                />
                <span>{currentLog.cognitive}%</span>
              </div>
              <div>
                <label className="flex items-center">
                  <Zap className="mr-2" /> Energy Level
                </label>
                <Slider
                  value={[currentLog.energy]}
                  onValueChange={(value) =>
                    handleSliderChange("energy", value[0])
                  }
                  max={100}
                  step={1}
                />
                <span>{currentLog.energy}%</span>
              </div>
              <div>
                <label className="flex items-center">
                  <Droplet className="mr-2" /> Hydration Level
                </label>
                <Slider
                  value={[currentLog.hydration]}
                  onValueChange={(value) =>
                    handleSliderChange("hydration", value[0])
                  }
                  max={100}
                  step={1}
                />
                <span>{currentLog.hydration}%</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Daily Supplements</h4>
                {supplements.map((supplement, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`supplement-${index}`}
                      checked={currentLog.supplements[supplement.name] || false}
                      onCheckedChange={() =>
                        handleSupplementChange(supplement.name)
                      }
                    />
                    <label htmlFor={`supplement-${index}`}>
                      {supplement.name} - {supplement.dosage} ({supplement.time}
                      )
                    </label>
                  </div>
                ))}
              </div>
              <Button onClick={handleSaveCurrentLog}>Save Daily Log</Button>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Supplement Tracker</h3>
            <div className="space-y-2">
              {supplements.map((supplement, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>
                    {supplement.name} - {supplement.dosage} ({supplement.time})
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteSupplement(supplement.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              <h4 className="font-semibold">Add New Supplement</h4>
              <Input
                placeholder="Name"
                value={newSupplement.name}
                onChange={(e) =>
                  setNewSupplement({ ...newSupplement, name: e.target.value })
                }
              />
              <Input
                placeholder="Dosage"
                value={newSupplement.dosage}
                onChange={(e) =>
                  setNewSupplement({ ...newSupplement, dosage: e.target.value })
                }
              />
              <Input
                placeholder="Time"
                value={newSupplement.time}
                onChange={(e) =>
                  setNewSupplement({ ...newSupplement, time: e.target.value })
                }
              />
              <Button onClick={handleAddSupplement}>Add Supplement</Button>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyLogs}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="cognitive"
                stroke="#8884d8"
                name="Cognitive Performance"
              />
              <Line
                type="monotone"
                dataKey="energy"
                stroke="#82ca9d"
                name="Energy Level"
              />
              <Line
                type="monotone"
                dataKey="hydration"
                stroke="#ff7300"
                name="Hydration Level"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BiohackingDashboard;
