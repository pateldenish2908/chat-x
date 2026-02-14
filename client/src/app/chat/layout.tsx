"use client";

import { usePathname } from "next/navigation";
import ChatList from "../components/ChatList";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChatSelected = pathname.startsWith("/chat/") && pathname !== "/chat";

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f1115]">
      {/* Sidebar - Chat List */}
      <div
        className={`bg-[#0f1115] border-r border-[#2d3139] flex flex-col transition-all duration-300 ${isChatSelected ? "hidden md:flex md:w-80 lg:w-96" : "w-full md:w-80 lg:w-96"
          }`}
      >
        <ChatList />
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${isChatSelected ? "flex" : "hidden md:flex"
          }`}
      >
        {children}
      </div>
    </div>
  );
}
