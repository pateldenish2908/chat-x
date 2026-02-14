"use client";

import { usePathname } from "next/navigation";
import ChatList from "../components/ChatList";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChatSelected = pathname.startsWith("/chat/") && pathname !== "/chat";

  return (
    <div className="flex h-screen">

      {/* Sidebar - Chat List */}
      <div
<<<<<<< HEAD
        className={`bg-white border-r shadow-md flex flex-col transition-all duration-300 ${
          isChatSelected ? "hidden md:flex md:w-80" : "w-full md:w-80"
        }`}
=======
        className={`bg-[#0f1115] border-r border-[#2d3139] shadow-md flex flex-col transition-all duration-300 ${isChatSelected ? "hidden md:flex md:w-80" : "w-full md:w-80"
          }`}
>>>>>>> main
      >
        <ChatList />
      </div>

      {/* Main Content Area */}
      <div
<<<<<<< HEAD
        className={`transition-all duration-300 ${
          isChatSelected ? "flex flex-1" : "hidden md:flex flex-1"
        }`}
=======
        className={`transition-all duration-300 ${isChatSelected ? "flex flex-1" : "hidden md:flex flex-1"
          }`}
>>>>>>> main
      >
        {children}
      </div>

    </div>
  );
}
