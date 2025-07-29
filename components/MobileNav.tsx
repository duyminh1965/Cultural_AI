"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,  
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { sidebar } from "./contents";


const MobileNav = () => {
  const pathname = usePathname();
  return (
    <section>
      <Sheet>
        <SheetTrigger>
          <Image src="/icons/hamburger.svg" width={30} height={30} alt="menu" className="cursor-pointer z-50" />
        </SheetTrigger>
        <SheetContent side="left" className="border-none">
          <Link href="/" className='flex cursor-pointer items-center gap-1 pb-10 pl-4'>
            <Image src="/icons/logo.svg" alt="logo" width={27} height={27} />
            <h1 className='text-3xl font-extrabold'>Simple Is Ai</h1>
          </Link>
          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <nav className="flex h-full flex-col gap-6">
                {sidebar.map(({ route, label, imgURL }) => {
                  const isActive = pathname === route || pathname.startsWith(`${route}/`);

                  return <SheetClose asChild key={route}><Link href={route} className={cn("flex gap-3 items-center py-4 max-lg:px-4 justify-start",{ 
                    'bg-nav-focus border-r-4 border-orange-400': isActive
                    })} >
                      <Image src={imgURL} alt={label} width={24} height={24} />
                      <p>{label}</p>
                  </Link></SheetClose>
                })}
              </nav>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  )
}

export default MobileNav