"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/utils/getCurrentUser";
import { useGetChatRoomsQuery } from "@/lib/services/chatApiSlice";
import { ChatRoom } from "@/types";
import { socket } from "@/utils/socket";
import { SocketEvents } from "@/constants/socketEvents";
import ChatHeader from "./ChatHeader";
import ChatRequests from "./ChatRequests";

export default function ChatList() {
  const user = getCurrentUser();
  const {
    data: rooms = [],
    isLoading,
    refetch,
  } = useGetChatRoomsQuery(user?._id, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    socket.on(SocketEvents.CHAT_LIST_UPDATED, () => {
      refetch();
    });

    return () => {
      socket.off(SocketEvents.CHAT_LIST_UPDATED);
    };
  }, [refetch]);

  return (
    <div className="w-full h-full border-r border-[#2d3139] bg-[#0f1115] flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-3 sm:p-6 border-b border-[#2d3139]">
        <ChatHeader />
      </div>

      {/* Chat Rooms List */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 custom-scrollbar">
        <ChatRequests />
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-slate-500 text-sm font-semibold tracking-wider">Syncing Securely...</span>
          </div>
        ) : rooms.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#1a1d23]/50 rounded-[2rem] m-2 border-2 border-dashed border-[#2d3139]">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-inner">💬</div>
            <p className="text-slate-200 font-bold text-xl mb-2">No conversations</p>
            <p className="text-slate-500 text-sm max-w-[200px] leading-relaxed">Your messages will appear here once you start chatting.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {rooms.map((room: ChatRoom) => (
              <li key={room._id}>
                <Link href={`/chat/${room._id}`}>
                  <div className="group p-4 sm:p-5 rounded-[1.25rem] sm:rounded-[1.5rem] bg-[#1a1d23]/40 hover:bg-[#1a1d23] transition-all duration-300 cursor-pointer border border-[#2d3139]/50 hover:border-indigo-500/30 relative overflow-hidden shadow-sm hover:shadow-indigo-500/5">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-center rounded-r-full" />
                    <div className="flex items-center gap-3 sm:gap-5">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 text-white flex items-center justify-center font-black text-base sm:text-lg shadow-lg shadow-indigo-500/20 ring-2 ring-[#0f1115]">
                        {room.participants[0]?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="font-bold text-slate-100 text-sm sm:text-base truncate group-hover:text-indigo-400 transition-colors">
                            {room.participants[0]?.name}
                          </h3>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                            {new Date(room.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate font-medium group-hover:text-slate-400 transition-colors">
                          Message synchronized
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Explore Users Button - Sticky Bottom */}
      <div className="p-4 sm:p-6 border-t border-[#2d3139] bg-[#0f1115] sticky bottom-0 z-20">
        <Link
          href="/explore"
          className="flex items-center justify-center gap-3 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 font-black shadow-xl shadow-indigo-900/40 group active:scale-[0.97] uppercase tracking-widest text-[10px] sm:text-xs"
        >
          <span className="text-lg sm:text-xl group-hover:rotate-180 transition-transform duration-500">＋</span>
          Discover People
        </Link>
      </div>
    </div>
  );
}
