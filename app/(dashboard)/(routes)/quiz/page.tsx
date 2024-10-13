"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Heart,
  Zap,
  Droplet,
  Sun,
  Book,
  Dumbbell,
  Apple,
  Leaf,
  Clock,
  Target,
  Users,
  Smile,
  Coffee,
  Moon,
} from "lucide-react";
import { personalityTypes } from "@/constants/quiz-page-constants";

const quizQuestions = [
  {
    question: "How often do you engage in focused deep work?",
    options: ["Rarely", "1-2 times a week", "3-4 times a week", "Daily"],
    category: "cognitive",
    icon: <Brain className="w-6 h-6 mr-2" />,
  },
  {
    question: "How would you rate your overall stress levels?",
    options: ["Very High", "High", "Moderate", "Low"],
    category: "stress",
    icon: <Heart className="w-6 h-6 mr-2" />,
  },
  {
    question: "How many hours of quality sleep do you get on average?",
    options: ["Less than 5", "5-6 hours", "7-8 hours", "More than 8 hours"],
    category: "sleep",
    icon: <Moon className="w-6 h-6 mr-2" />,
  },
  {
    question: "How much water do you drink daily?",
    options: ["Less than 2 cups", "2-4 cups", "5-7 cups", "8+ cups"],
    category: "hydration",
    icon: <Droplet className="w-6 h-6 mr-2" />,
  },
  {
    question: "How often do you expose yourself to natural sunlight?",
    options: ["Rarely", "Occasionally", "Regularly", "Daily"],
    category: "light",
    icon: <Sun className="w-6 h-6 mr-2" />,
  },
  {
    question: "How often do you read books or engage in learning activities?",
    options: ["Rarely", "Once a month", "Weekly", "Daily"],
    category: "learning",
    icon: <Book className="w-6 h-6 mr-2" />,
  },
  {
    question: "How frequently do you exercise?",
    options: [
      "Rarely",
      "1-2 times a week",
      "3-4 times a week",
      "5+ times a week",
    ],
    category: "fitness",
    icon: <Dumbbell className="w-6 h-6 mr-2" />,
  },
  {
    question: "How would you describe your diet?",
    options: [
      "Mostly processed foods",
      "Mix of processed and whole foods",
      "Mostly whole foods",
      "Strict whole food diet",
    ],
    category: "nutrition",
    icon: <Apple className="w-6 h-6 mr-2" />,
  },
  {
    question: "How often do you practice mindfulness or meditation?",
    options: ["Never", "Occasionally", "Weekly", "Daily"],
    category: "mindfulness",
    icon: <Leaf className="w-6 h-6 mr-2" />,
  },
  {
    question: "How well do you manage your time?",
    options: ["Poorly", "Somewhat", "Well", "Very well"],
    category: "productivity",
    icon: <Clock className="w-6 h-6 mr-2" />,
  },
  {
    question: "How often do you set and review your personal goals?",
    options: ["Rarely", "Once a year", "Monthly", "Weekly"],
    category: "goal_setting",
    icon: <Target className="w-6 h-6 mr-2" />,
  },
  {
    question: "How would you rate your social connections and support network?",
    options: ["Poor", "Fair", "Good", "Excellent"],
    category: "social",
    icon: <Users className="w-6 h-6 mr-2" />,
  },
  {
    question:
      "How often do you try new experiences or step out of your comfort zone?",
    options: ["Rarely", "Occasionally", "Regularly", "Frequently"],
    category: "growth",
    icon: <Zap className="w-6 h-6 mr-2" />,
  },
  {
    question: "How would you rate your overall life satisfaction?",
    options: ["Low", "Moderate", "High", "Very High"],
    category: "satisfaction",
    icon: <Smile className="w-6 h-6 mr-2" />,
  },
  {
    question: "How do you handle setbacks or failures?",
    options: [
      "I give up easily",
      "I struggle but try to overcome",
      "I learn from them",
      "I see them as opportunities",
    ],
    category: "resilience",
    icon: <Heart className="w-6 h-6 mr-2" />,
  },
  {
    question:
      "How often do you reflect on your personal values and align your actions with them?",
    options: ["Rarely", "Occasionally", "Regularly", "Daily"],
    category: "values",
    icon: <Target className="w-6 h-6 mr-2" />,
  },
  {
    question: "How would you describe your work-life balance?",
    options: ["Poor", "Fair", "Good", "Excellent"],
    category: "balance",
    icon: <Clock className="w-6 h-6 mr-2" />,
  },
  {
    question: "How often do you engage in creative activities?",
    options: ["Rarely", "Occasionally", "Weekly", "Daily"],
    category: "creativity",
    icon: <Brain className="w-6 h-6 mr-2" />,
  },
  {
    question: "How do you manage your digital habits and screen time?",
    options: ["Poorly", "Somewhat", "Well", "Very well"],
    category: "digital_wellness",
    icon: <Coffee className="w-6 h-6 mr-2" />,
  },
  {
    question: "How often do you practice gratitude?",
    options: ["Rarely", "Occasionally", "Weekly", "Daily"],
    category: "gratitude",
    icon: <Heart className="w-6 h-6 mr-2" />,
  },
];

const InteractiveQuizAssessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState<any>(0);
  const [answers, setAnswers] = useState<any>({});
  const [showResults, setShowResults] = useState<any>(false);

  const handleAnswer = (answer:any) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateCategoryScore = (category:any) => {
    const relevantQuestions = quizQuestions.filter(
      (q) => q.category === category
    );
    const score = relevantQuestions.reduce((acc, q, index) => {
      const answerIndex = q.options.indexOf(
        answers[
          quizQuestions.findIndex(
            (question) => question.category === q.category
          )
        ]
      );
      return acc + (answerIndex + 1);
    }, 0);
    return score / (relevantQuestions.length * 4);
  };

  const getPersonalityType = () => {
    const scores = {
      cognitive: calculateCategoryScore("cognitive"),
      physical:
        (calculateCategoryScore("fitness") +
          calculateCategoryScore("nutrition")) /
        2,
      emotional:
        (calculateCategoryScore("stress") +
          calculateCategoryScore("mindfulness")) /
        2,
      social: calculateCategoryScore("social"),
      productivity: calculateCategoryScore("productivity"),
      growth: calculateCategoryScore("learning"),
      creativity: calculateCategoryScore("creativity"),
      resilience: calculateCategoryScore("resilience"),
      balance: calculateCategoryScore("balance"),
      purpose:
        (calculateCategoryScore("values") +
          calculateCategoryScore("goal_setting")) /
        2,
    };

    const topCategories = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);

    const typeIndex = Math.floor(
      (topCategories[0].charCodeAt(0) +
        topCategories[1].charCodeAt(0) +
        topCategories[2].charCodeAt(0)) %
        10
    );

    return personalityTypes[typeIndex];
  };

  const getCategoryAssessment = (category:any) => {
    const score = calculateCategoryScore(category);
    if (score < 0.25) return "Needs attention";
    if (score < 0.5) return "Developing";
    if (score < 0.75) return "Proficient";
    return "Excellent";
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  return (
    <Card className="w-full min-h-screen">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Self-Improvement Assessment
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!showResults ? (
          <div>
            <Progress
              value={(currentQuestion / quizQuestions.length) * 100}
              className="mb-4"
            />
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              {quizQuestions[currentQuestion].icon}
              {quizQuestions[currentQuestion].question}
            </h3>
            <RadioGroup onValueChange={handleAnswer} className="space-y-2">
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Your Self-Improvement Profile
            </h3>
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">
                Your Self-Improvement Personality Type:
              </h4>
              <p className="font-bold">{getPersonalityType().type}</p>
              <p className="mt-2">{getPersonalityType().description}</p>
              <p className="mt-2 font-medium">
                Advice: {getPersonalityType().advice}
              </p>
            </div>
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">
                Category Assessments:
              </h4>
              {quizQuestions.map((q) => {
                const assessment = getCategoryAssessment(q.category);
                return (
                  <div key={q.category} className="mb-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">
                        {q.category.replace("_", " ")}
                      </span>
                      <span>{assessment}</span>
                    </div>
                    <Progress
                      value={calculateCategoryScore(q.category) * 100}
                      className="mb-1"
                    />
                  </div>
                );
              })}
            </div>
            <Button onClick={resetQuiz} className="mt-4 w-full">
              Retake Assessment
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InteractiveQuizAssessment;
