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
    <div className="w-full h-full border-r border-border bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-border">
        <ChatHeader />
      </div>

      {/* Chat Rooms List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
        <ChatRequests />
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <span className="text-[#a3a3a0] text-xs font-medium tracking-wide">Connecting...</span>
          </div>
        ) : rooms.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#f9f9f8] rounded-2xl m-2 border border-dashed border-border">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm">💬</div>
            <p className="text-foreground font-semibold text-lg mb-1">No chats yet</p>
            <p className="text-[#6e6e6a] text-sm max-w-[200px] leading-relaxed">Start exploring to find people and begin conversations.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {rooms.map((room: ChatRoom) => (
              <li key={room._id}>
                <Link href={`/chat/${room._id}`}>
                  <div className="group p-4 rounded-xl hover:bg-[#f3f3f2] transition-all duration-200 cursor-pointer border border-transparent hover:border-border relative overflow-hidden">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#e8e8e6] text-foreground flex items-center justify-center font-medium text-lg uppercase">
                        {room.participants[0]?.name?.[0] || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h3 className="font-semibold text-foreground text-sm truncate">
                            {room.participants[0]?.name}
                          </h3>
                          <span className="text-[10px] text-[#a3a3a0] font-medium">
                            {new Date(room.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-[#6e6e6a] truncate">
                          Synced and secure
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
      <div className="p-4 border-t border-border bg-background sticky bottom-0 z-20">
        <Link
          href="/explore"
          className="flex items-center justify-center gap-2 w-full bg-[#1d1d1b] hover:opacity-90 text-white py-3.5 rounded-xl transition-all duration-200 font-medium shadow-sm active:scale-[0.98] text-sm"
        >
          <span className="text-lg">＋</span>
          Discover People
        </Link>
      </div>
    </div>
  );
}
