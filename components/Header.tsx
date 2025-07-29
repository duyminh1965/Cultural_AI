"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";

export const Header = () => {
  const { user, isSignedIn } = useUser();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathName = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  
  const avatar = String(user?.firstName || "")[0] + String(user?.lastName || "")[0];

  if (isSignedIn === false) {
    router.push("/sign-in");
  }

   const navItems = [
    { route: "/", label: "Home", icon: Compass },
    { route: "/chat", label: "Chat", icon: User },
    { route: "/dashboard", label: "Profile", icon: User },
    { route: "/travel", label: "Travel", icon: Compass },
    { route: "/live", label: "Live", icon: Settings },

    // ...(hasPermission('view_analytics') ? [{ id: 'analytics', label: 'Analytics', icon: BarChart3 }] : []),
    // ...(hasPermission('manage_users') ? [{ id: 'users', label: 'Users', icon: UsersIcon }] : []),
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="flex items-center space-x-2"
            >
              <Compass className="h-8 w-8 text-teal-600" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-amber-600 bg-clip-text text-transparent">
                Cultural Concierge
              </h1>
            </motion.div>
          </div>

          <nav className="flex items-center space-x-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathName === item.route;

              return (
                <Link
                  href={item.route}
                  key={index}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-teal-100 text-teal-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <SignedOut>
            
            <div className="flex items-center justify-center w-full pb-14 max-lg:px-4 lg:pr-8">
              <Link href="/sign-in">Sign in</Link>
              
            </div>
          </SignedOut>
          <SignedIn>
            {/* User Menu */}
            <div className="relative">
              <motion.button
                onClick={() => setShowUserMenu(!showUserMenu)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-amber-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {avatar}
                </div>
                <span className="hidden sm:inline">{user?.firstName}</span>
                <ChevronDown className="h-4 w-4" />
              </motion.button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-64 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/50 py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-slate-200/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">
                            {user?.firstName} {user?.lastName}
                          </div>
                          <div className="text-sm text-slate-600">
                            {user?.primaryEmailAddress?.emailAddress}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <Link
                        href="/dashboard"
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 flex items-center space-x-2"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>

                      <button
                        onClick={() => signOut(() => router.push('/'))}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </SignedIn>
        </div>
      </div>
    </motion.header>
  );
};
