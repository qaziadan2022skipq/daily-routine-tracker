// 'use client'

// import React, { useState, useEffect } from 'react';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Palette } from 'lucide-react';

// interface Theme {
//   [key: string]: { [key: string]: string };
// }

// const themes: Theme = {
//   default: {
//     '--primary': '#3b82f6',
//     '--secondary': '#10b981',
//     '--background': '#f3f4f6',
//     '--foreground': '#1f2937',
//     '--card': '#ffffff',
//     '--card-foreground': '#1f2937',
//     '--border': '#e5e7eb',
//     '--input': '#ffffff',
//   },
//   dark: {
//     '--primary': '#60a5fa',
//     '--secondary': '#34d399',
//     '--background': '#1f2937',
//     '--foreground': '#f9fafb',
//     '--card': '#374151',
//     '--card-foreground': '#f9fafb',
//     '--border': '#4b5563',
//     '--input': '#374151',
//   },
//   pastel: {
//     '--primary': '#ffa69e',
//     '--secondary': '#faf3dd',
//     '--background': '#b8f2e6',
//     '--foreground': '#3d405b',
//     '--card': '#faf3dd',
//     '--card-foreground': '#3d405b',
//     '--border': '#aed9e0',
//     '--input': '#faf3dd',
//   },
//   neon: {
//     '--primary': '#f0f',
//     '--secondary': '#0ff',
//     '--background': '#111',
//     '--foreground': '#fff',
//     '--card': '#222',
//     '--card-foreground': '#0f0',
//     '--border': '#f0f',
//     '--input': '#333',
//   },
//   earth: {
//     '--primary': '#6b705c',
//     '--secondary': '#a5a58d',
//     '--background': '#ffe8d6',
//     '--foreground': '#3f4238',
//     '--card': '#ddbea9',
//     '--card-foreground': '#3f4238',
//     '--border': '#cb997e',
//     '--input': '#ffe8d6',
//   },
//   ocean: {
//     '--primary': '#48cae4',
//     '--secondary': '#90e0ef',
//     '--background': '#caf0f8',
//     '--foreground': '#03045e',
//     '--card': '#ade8f4',
//     '--card-foreground': '#03045e',
//     '--border': '#0077b6',
//     '--input': '#caf0f8',
//   },
//   sunset: {
//     '--primary': '#f72585',
//     '--secondary': '#7209b7',
//     '--background': '#3a0ca3',
//     '--foreground': '#f0f0f0',
//     '--card': '#4361ee',
//     '--card-foreground': '#f0f0f0',
//     '--border': '#4cc9f0',
//     '--input': '#3a0ca3',
//   },
//   forest: {
//     '--primary': '#40916c',
//     '--secondary': '#74c69d',
//     '--background': '#d8f3dc',
//     '--foreground': '#081c15',
//     '--card': '#b7e4c7',
//     '--card-foreground': '#081c15',
//     '--border': '#52b788',
//     '--input': '#d8f3dc',
//   },
// };

// const ThemeSwitcher: React.FC = () => {
//     const [currentTheme, setCurrentTheme] = useState<keyof typeof themes>('default');
//     const [, forceUpdate] = useState({});
  
//     useEffect(() => {
//       // Apply the selected theme
//       const root = document.documentElement;
//       Object.entries(themes[currentTheme]).forEach(([property, value]) => {
//         root.style.setProperty(property, value);
//       });
//       console.log('Theme applied:', currentTheme, themes[currentTheme]);
//       // Force a re-render
//       forceUpdate({});
//     }, [currentTheme]);
  
//     const handleThemeChange = (theme: keyof typeof themes) => {
//       console.log('Theme selected:', theme);
//       setCurrentTheme(theme);
//     };
  
//     return (
//       <div className="flex flex-col items-start space-y-2 p-4 bg-card text-card-foreground rounded-lg shadow-md transition-all duration-200">
//         <div className="flex items-center space-x-2">
//           <Palette className="text-primary w-6 h-6" />
//           <Select 
//             value={currentTheme as string} // Type assertion here
//             onValueChange={handleThemeChange}
//           >
//             <SelectTrigger className="w-[180px] border-primary">
//               <SelectValue placeholder="Select a theme" />
//             </SelectTrigger>
//             <SelectContent>
//               {Object.keys(themes).map((theme) => (
//                 <SelectItem key={theme} value={theme} className="capitalize">
//                   {theme} Theme
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//         <div className="text-sm">
//           Current theme: <span className="font-bold text-primary">{currentTheme}</span>
//         </div>
//         <div className="flex space-x-2">
//           <div className="w-6 h-6 rounded-full" style={{ backgroundColor: 'var(--primary)' }}></div>
//           <div className="w-6 h-6 rounded-full" style={{ backgroundColor: 'var(--secondary)' }}></div>
//           <div className="w-6 h-6 rounded-full" style={{ backgroundColor: 'var(--background)' }}></div>
//           <div className="w-6 h-6 rounded-full" style={{ backgroundColor: 'var(--foreground)' }}></div>
//         </div>
//       </div>
//     );
// };

// export default ThemeSwitcher;

"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ModeToggle = () => {
  const { setTheme } = useTheme()

  return (
    <div className="dark:bg-black w-full">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  )
}
export default ModeToggle;
 