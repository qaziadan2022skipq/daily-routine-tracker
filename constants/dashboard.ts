import {
  MessageCirclePlus,
  Folder,
  SendToBack,
  DollarSign,
  SmileIcon,
  Book,
  GlassWater,
  Bed,
  SmilePlus,
  File,
  Bot,
  Medal,
  MessageSquareHeart,
  Goal,
  MessageSquareDiff,
  Palette,
} from "lucide-react";

export const sidebarRoutes = [
  {
    label: "dashboard",
    icon: MessageCirclePlus,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "zen Zone Meditation Log",
    icon: SmileIcon,
    href: "/zen-zone",
    color: "text-orange-500",
  },
  {
    label: "Book Tracker",
    icon: Book,
    href: "/book-tracker",
    color: "text-orange-500",
  },
  {
    label: "Water Intake Tracker",
    icon: GlassWater,
    href: "/water-intake-tracker",
    color: "text-orange-500",
  },
  {
    label: "Sleep Tracker",
    icon: Bed,
    href: "/sleep-tracker",
    color: "text-orange-500",
  },
  {
    label: "Mood Tracker",
    icon: SmilePlus,
    href: "/mood-tracker",
    color: "text-orange-500",
  },
  {
    label: "Task Manager",
    icon: File,
    href: "/task-manager",
    color: "text-orange-500",
  },
  {
    label: "Progress Achievements",
    icon: Medal,
    href: "progress-achievements",
    color: "text-orange-500",
  },
  {
    label: "Inspiration Feeds",
    icon: MessageSquareHeart,
    href: "inspiration-feeds",
    color: "text-orange-500",
  },
  {
    label: "Daily Goals",
    icon: Goal,
    href: "daily-goals",
    color: "text-orange-500",
  },
  {
    label: "Review Prompts",
    icon: MessageSquareDiff,
    href: "improved-review-prompts",
    color: "text-orange-500",
  },
  {
    label: "Manage Subscriptions",
    icon: DollarSign,
    href: "/manage_subscriptions",
    color: "text-pink-400",
  },
  {
    label: "Personal Ai",
    icon: Bot,
    href: "/conversation",
    color: "text-pink-400",
  },
];
