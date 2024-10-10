'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Review {
  type: string;
  date: string;
  responses: { [key: string]: string };
}

const ReviewPrompts: React.FC = () => {
  const [reviewType, setReviewType] = useState<'weekly' | 'monthly'>('weekly');
  const [currentReview, setCurrentReview] = useState<Review>({
    type: 'weekly',
    date: new Date().toISOString(),
    responses: {}
  });
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [selectedReviewIndex, setSelectedReviewIndex] = useState<number>(-1);

  const weeklyPrompts = [
    "What were your main achievements this week?",
    "What challenges did you face and how did you overcome them?",
    "What progress did you make on your goals?",
    "What did you learn this week?",
    "What are your top priorities for next week?",
  ];

  const monthlyPrompts = [
    "What were your biggest accomplishments this month?",
    "How have you grown or changed this month?",
    "What habits or routines worked well for you?",
    "What areas of your life need more attention next month?",
    "What are your main goals for the upcoming month?",
  ];

  useEffect(() => {
    // Load saved reviews from localStorage
    const savedReviews: Review[] = JSON.parse(localStorage.getItem('allReviews') || '[]');
    setAllReviews(savedReviews);
    if (savedReviews.length > 0) {
      setCurrentReview(savedReviews[0]);
    } else {
      startNewReview();
    }
  }, []);

  const startNewReview = () => {
    const newReview: Review = {
      type: reviewType,
      date: new Date().toISOString(),
      responses: {}
    };
    setCurrentReview(newReview);
    setSelectedReviewIndex(-1);
  };

  const handleResponseChange = (prompt: string, response: string) => {
    const updatedReview = {
      ...currentReview,
      responses: { ...currentReview.responses, [prompt]: response }
    };
    setCurrentReview(updatedReview);
  };

  const saveReview = () => {
    let updatedReviews;
    if (selectedReviewIndex === -1) {
      // New review
      updatedReviews = [currentReview, ...allReviews];
    } else {
      // Update existing review
      updatedReviews = [...allReviews];
      updatedReviews[selectedReviewIndex] = currentReview;
    }
    setAllReviews(updatedReviews);
    localStorage.setItem('allReviews', JSON.stringify(updatedReviews));
    setSelectedReviewIndex(0);
  };

  const selectReview = (index: number) => {
    setSelectedReviewIndex(index);
    setCurrentReview(allReviews[index]);
    setReviewType(allReviews[index].type as 'weekly' | 'monthly');
  };

  const currentPrompts = reviewType === 'weekly' ? weeklyPrompts : monthlyPrompts;
  const currentPrompt = currentPrompts[currentPromptIndex];

  const nextPrompt = () => {
    if (currentPromptIndex < currentPrompts.length - 1) {
      setCurrentPromptIndex(currentPromptIndex + 1);
    }
  };

  const prevPrompt = () => {
    if (currentPromptIndex > 0) {
      setCurrentPromptIndex(currentPromptIndex - 1);
    }
  };

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="mr-2" />
            {reviewType === 'weekly' ? 'Weekly' : 'Monthly'} Review Prompts
          </div>
          <Select value={selectedReviewIndex.toString()} onValueChange={(value) => selectReview(parseInt(value))}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a review" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-1">New Review</SelectItem>
              {allReviews.map((review, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {new Date(review.date).toLocaleDateString()} - {review.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button
            variant={reviewType === 'weekly' ? 'default' : 'outline'}
            onClick={() => setReviewType('weekly')}
            className="mr-2"
          >
            Weekly Review
          </Button>
          <Button
            variant={reviewType === 'monthly' ? 'default' : 'outline'}
            onClick={() => setReviewType('monthly')}
          >
            Monthly Review
          </Button>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold">{currentPrompt}</h3>
          <Textarea
            value={currentReview.responses?.[currentPrompt] || ''}
            onChange={(e) => handleResponseChange(currentPrompt, e.target.value)}
            placeholder="Enter your response here"
            rows={4}
          />
          <div className="flex justify-between">
            <Button onClick={prevPrompt} disabled={currentPromptIndex === 0}><ChevronLeft />Previous</Button>
            <Button onClick={nextPrompt} disabled={currentPromptIndex === currentPrompts.length - 1}>Next<ChevronRight /></Button>
          </div>
        </div>
        <div className="mt-8 flex justify-between">
          <Button onClick={startNewReview}>Start New Review</Button>
          <Button onClick={saveReview}>Save Review</Button>
        </div>
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Review Summary</h3>
          {currentPrompts.map((prompt, index) => (
            <div key={index} className="mb-2">
              <p className="font-medium">{prompt}</p>
              <p className="text-sm text-gray-600">{currentReview.responses?.[prompt] || 'Not answered yet'}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewPrompts;
