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
        className={`bg-[#0f1115] border-r border-[#2d3139] shadow-md flex flex-col transition-all duration-300 ${
          isChatSelected ? "hidden md:flex md:w-80" : "w-full md:w-80"
        }`}
      >
        <ChatList />
      </div>

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ${
          isChatSelected ? "flex flex-1" : "hidden md:flex flex-1"
        }`}
      >
        {children}
      </div>

    </div>
  );
}
