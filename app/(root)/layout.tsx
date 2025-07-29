import { Header } from "@/components/Header";
import React from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='relative flex flex-col'>
        <main className='relative flex'>
            {/* <LeftSidebar /> */}
            <section className="flex min-h-screen flex-1 flex-col px-4 sm:px-14">
              <Header />
              <div className="mx-auto flex w-full flex-col max-sm:px-4">
                <div className="flex h-16 items-center justify-between md:hidden">
                  
                    {/* <Image 
                      src="/icons/logo.svg"
                      width={50}
                      height={50}
                      alt="Menu icon"
                    />    */}
                    {/* <MobileNav /> */}
                </div>
                <div className="flex flex-col md:pb-14">
                  {children}
                </div>
              </div>
            </section>
        </main>        
    </div>
  );
}
