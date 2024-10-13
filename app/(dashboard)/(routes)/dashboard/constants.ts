import {
  MessageCirclePlus,
  DollarSign,
  SmileIcon,
  Book,
  Bed,
  Bot,
  Medal,
  MessageSquareHeart,
  Goal,
  TrophyIcon,
  Calendar,
  Dumbbell,
  PenBoxIcon,
  TrendingUp,
  BookCopy,
  BotMessageSquareIcon,
} from "lucide-react";

export const dashboardRoutes = [
  {
    label: "Personal Growth Dashboard",
    icon: TrendingUp,
    href: "/personal-growth-dashboard",
    color: "text-green-500",
    bgColor: "bg-green-500/20",
  },
  {
    label: "Achievements",
    icon: TrophyIcon,
    href: "/achievements",
    color: "text-sky-500",
    bgColor: "bg-sky-500/20",
  },
  {
    label: "Bio Hacking",
    icon: SmileIcon,
    href: "/bio-hacking",
    color: "text-green-700",
    bgColor: "bg-green-700/20",
  },
  {
    label: "AI Trends Analysis",
    icon: Book,
    href: "/ai-trends-analysis",
    color: "text-orange-500",
    bgColor: "bg-orange-700/20",
  },
  {
    label: "Daily Goals",
    icon: Goal,
    href: "daily-goals",
    color: "text-red-500",
    bgColor: "bg-red-700/20",
  },
  {
    label: "Journals",
    icon: BookCopy,
    href: "/journals",
    color: "text-red-400",
    bgColor: "bg-red-400/20",
  },
  {
    label: "Progress Achievements",
    icon: Medal,
    href: "/progress-achievements",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/20",
  },
  {
    label: "Calander",
    icon: Calendar,
    href: "/calander",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/20",
  },
  // {
  //   label: "Zen Zone Meditation Log",
  //   icon: Calendar,
  //   href: "/zen-zone",
  //   color: "text-orange-500",
  // },
  {
    label: "Quiz",
    icon: PenBoxIcon,
    href: "/quiz",
    color: "text-purple-500",
    bgColor: "bg-purple-500/20",
  },
  {
    label: "Inspiration Feeds",
    icon: MessageSquareHeart,
    href: "/inspiration-feeds",
    color: "text-zinc-500",
    bgColor: "bg-zinc-500/20",
  },
  {
    label: "Exercise Tracker",
    icon: Dumbbell,
    href: "/exercise-tracker",
    color: "text-pink-500",
    bgColor: "bg-pink-500/20",
  },
  {
    label: "Improvement Advisor",
    icon: BotMessageSquareIcon,
    href: "/improvement-advisor",
    color: "text-blue-600",
    bgColor: "bg-blue-600/20",
  },
];
