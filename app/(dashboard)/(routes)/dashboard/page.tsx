"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

import Image from "next/image";
import { dashboardRoutes } from "./constants";
import { useUser } from "@clerk/nextjs";

const Dashboard = () => {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      localStorage.setItem("userId", user?.id);
    }
  });
  return (
    <div className="min-h-screen bg-muted-foreground">
      <div className="mb-8 flex flex-col items-center space-y-2">
        {/* <h2 className="text-2xl mt-6 md:text-4xl font-bold text-muted text-center">
          Welcome 👋
        </h2> */}
        <Image
          className="mt-2 lg:mt-6 px-4"
          src="/nudge-logo.png"
          width={400}
          height={400}
          alt="main"
        />

        <p className="text-primary-foreground font-light text-small md:text-lg text-center">
          Your Daily Routine Tracker
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 mt-12 gap-4 px-4 md:px-32 overflow-scroll lg:overflow-hidden">
        {dashboardRoutes.map((tool, index) => (
          <div key={index}>
            <Card
              onClick={() => router.push(tool.href)}
              key={tool.href}
              className="p-4 border-black/4 items-center flex justify-between hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-center gap-x-4">
                <div className={cn("p-2 w-ft rounded-md", tool.bgColor)}>
                  <tool.icon className={cn("w-8 h-8", tool.color)} />
                </div>
                <div className="font-semibold text-sm">{tool.label}</div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
