"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Bot, Terminal, PercentCircle, TerminalSquare, ShoppingCart } from "lucide-react";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define the feature structure
interface Feature {
  text?: string;
  description?: string;
  icon?: React.ReactNode;
}

// Define the tier structure
interface Tier {
  name: string;
  price: string;
  features: (string | Feature)[];
  limitations?: string[];
  buttonUrl: string;
}

const SubscriptionTiers = () => {
  const tiers: Tier[] = [
    {
      name: "Freemium",
      price: "Free",
      features: [
        "Basic habit tracking",
        "Simple mood logging",
        "Water intake tracker",
        "Book reading log",
        "Basic sleep tracking",
        "Limited weekly review prompts",
        "3 personal goals",
      ],
      limitations: [
        "Limited data storage",
        "Basic insights only",
        "No meditation log",
        "Limited customization",
        "No access to Improvement Advisor bot",
      ],
      buttonUrl: "/",
    },
    {
      name: "Growth Pro",
      price: "$9.99/month",
      features: [
        {
          text: "AI-powered Improvement Advisor bot",
          description:
            "Get personalized advice and guidance to accelerate your growth",
          icon: <Bot className="mr-2 h-5 w-5 text-blue-500" />,
        },
        "Advanced habit tracking with detailed insights",
        "Comprehensive mood analysis and trends",
        "Detailed water intake analytics",
        "Extensive book library and reading insights",
        "Advanced sleep quality analysis",
        "Zen Zone meditation log with reflections",
        "In-depth weekly and monthly review prompts",
        "Unlimited personal goals with progress tracking",
        "Personalized growth insights",
        "Ad-free experience",
        "Priority customer support",
        "Data export functionality",
      ],
      buttonUrl: "/api/stripe-month",
    },
  ];

  const openUrl = async (url: string) => {
    const response = await axios.get(url);
    window.location.href = response.data.url;
  };
  const subscribeYearly = async (url: string) => {
    const response = await axios.get(url);
    window.location.href = response.data.url;
  };

  const renderFeatures = (
    features: (string | Feature)[],
    isLimitation = false
  ) => (
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          {isLimitation ? (
            <X className="mr-2 h-5 w-5 flex-shrink-0 text-red-500" />
          ) : typeof feature !== "string" && feature.icon ? (
            feature.icon
          ) : (
            <Check className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
          )}
          <div>
            {typeof feature === "string" ? (
              feature
            ) : (
              <>
                <span className="font-medium">{feature.text}</span>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Choose Your Growth Plan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg shadow-lg ${
                index === 1 ? "border-2 border-blue-500" : ""
              }`}
            >
              <h3 className="text-xl font-bold mb-4">{tier.name}</h3>
              <p className="text-3xl font-bold mb-6">{tier.price}</p>
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Features:</h4>
                {renderFeatures(tier.features)}
              </div>
              {tier.limitations && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Limitations:</h4>
                  {renderFeatures(tier.limitations, true)}
                </div>
              )}
              <Button
                onClick={() => openUrl(tier.buttonUrl)}
                className="w-full"
                variant={index === 1 ? "default" : "outline"}
              >
                {index === 0 ? "Start Free" : "Upgrade Now"}
              </Button>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center text-center mt-8 justify-center text-sm">
          <div>
            <Alert className="w-fit px-6">
              <AlertTitle className="text-lg font-bold">30$ off</AlertTitle>
              <AlertDescription className="flex items-center gap-x-1">
                <p>Get 30$ off on yearly subscription</p>
                <p className="text-md font-semibold">Just for 89.99$</p>
              </AlertDescription>
              <Button onClick={() => subscribeYearly("/api/stripe-year")} className="mt-2">Buy Now</Button>
            </Alert>
          </div>
          <p>
            All plans come with a 14-day money-back guarantee. No questions
            asked.
          </p>
          <p className="mt-2">
            Need help deciding? Contact our support team for guidance.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionTiers;
