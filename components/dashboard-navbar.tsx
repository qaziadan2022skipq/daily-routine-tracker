"use server";

import Image from "next/image";
// import { getApiLimit } from "@/lib/api-limits";
// import { checkSubscription } from "@/lib/subscription";
// import { UserButton } from "@clerk/nextjs";
import MobileSidebar from "./mobile-sidebar";
import ModeToggle from "./theme-switcher";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

const Navbar = async () => {
  //   const apiLimitCount = await getApiLimit() as number;
  //   const isPro = await checkSubscription() as boolean;
  return (
    <div className="flex bg-[#161717] items-center justify-between p-6">
      <div>
        <MobileSidebar />
      </div>
      <div className="flex lg:hidden w-full items-center justify-center">
      <Link
          href="/dashboard"
          className=""
        >
        <Image src={"/main-logo.png"} width={120} height={90} alt="mainlogo" />
        </Link>
      </div>
      <div className="flex justify-end">
        <div className="flex gap-x-2">
          <ModeToggle />
          <UserButton />
        </div>
      </div>
    </div>
  );
};
export default Navbar;
