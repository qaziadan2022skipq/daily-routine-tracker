"use client";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    setInterval(() => {
      window.location.href = "/sign-in"
    }, 2000)
  }, [])
  return (
    <div className="flex w-full min-h-screen items-center justify-center">
      <Image
        className="animate-pulse duration-1000"
        src={"/logo.png"}
        width={700}
        height={700}
        alt="Main Image"
      />
    </div>
  );
}
