"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, ThumbsUp, Share2 } from "lucide-react";
import axios from "axios";

interface Inspiration {
  id: string;
  content: string;
  author?: string;
  category: string;
  type: string;
}

const InspirationFeed = () => {
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);

  useEffect(() => {
    fetchInspirations();
  }, []);

  const fetchInspirations = async () => {
    const response = await axios.get("/api/inspiration");
    const data = response.data;
    setInspirations(data.inspirations);
  };

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="mr-2" />
          Your Daily Inspiration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inspirations.map((item) => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <p className="text-sm text-blue-600 mb-2">{item.category}</p>
                <p className="text-lg mb-2">{item.content}</p>
                {item.author && (
                  <p className="text-sm text-gray-600">- {item.author}</p>
                )}
                <div className="flex justify-between items-center mt-4">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="mr-1" size={16} /> Like
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="mr-1" size={16} /> Share
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">{item.type}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InspirationFeed;
