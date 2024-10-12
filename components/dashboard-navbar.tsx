"use server";

// import { getApiLimit } from "@/lib/api-limits";
// import { checkSubscription } from "@/lib/subscription";
// import { UserButton } from "@clerk/nextjs";
import MobileSidebar from "./mobile-sidebar";
import { UserSquare2Icon } from "lucide-react";
import ModeToggle from "./theme-switcher";

import { UserButton } from "@clerk/nextjs";

const Navbar = async () => {
  //   const apiLimitCount = await getApiLimit() as number;
  //   const isPro = await checkSubscription() as boolean;
  return (
    <div className="flex bg-[#161717] items-center p-6">
      <MobileSidebar />
      <div className="flex w-full justify-end">
        <div className="flex gap-x-2">
          <ModeToggle />
          <UserButton />
        </div>
      </div>
    </div>
  );
};
export default Navbar;
