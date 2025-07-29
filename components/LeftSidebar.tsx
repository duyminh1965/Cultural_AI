"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { sidebar } from "./contents";
import { usePathname, useRouter } from "next/navigation";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { Button } from "./ui/button";

const LeftSidebar = () => {
  const pathName = usePathname();
  const router = useRouter();
  const {signOut} = useClerk();
  return (
    <section className="left_sidebar h[calc(100vh-5px)]">
      <nav className="flex flex-col gap-4">
        <Link
          href="/"
          className="flex clacursor-pointer items-center gap-1 pb-10 max-lg:justify-center"
        >
          <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
          <h1 className="text-2xl font-extrabold max-lg:hidden">
            Simple Is Ai
          </h1>
                  
        </Link>

        {sidebar.map((item, index) => {
          
          const isActive = pathName === item.route;
          

          return (
            <Link
              href={item.route}
              key={index}
              className={`flex items-center gap-2 p-2  rounded-md cursor-pointer ${
                isActive && "border-r-4 border-blue-500"
              }`}
            >
              <img src={item.imgURL} alt={item.label} className="w-6 h-6" />
              <span className="text-lg font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <SignedOut>
        <div className="flex items-center justify-center w-full pb-14 max-lg:px-4 lg:pr-8">
          <Button
            asChild
            className="text-xl w-full bg-orange-400 font-extrabold"
          >
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex items-center justify-center w-full pb-14 max-lg:px-4 lg:pr-8">
          <Button
            className="text-xl w-full bg-orange-400 font-extrabold"
            onClick={() => signOut(() => router.push("/"))}
          >
            Log Out
          </Button>
        </div>
             
      </SignedIn>
    </section>
  );
};

export default LeftSidebar;
