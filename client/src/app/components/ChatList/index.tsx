"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/utils/getCurrentUser";
import { useGetChatRoomsQuery } from "@/lib/services/chatApiSlice";
import { ChatRoom } from "@/types";
import { socket } from "@/utils/socket";
<<<<<<< HEAD
=======
import { SocketEvents } from "@/constants/socketEvents";
>>>>>>> main
import ChatHeader from "./ChatHeader";

const user = getCurrentUser();

export default function ChatList() {
  const {
    data: rooms = [],
    isLoading,
    refetch,
  } = useGetChatRoomsQuery(user?._id, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
<<<<<<< HEAD
    socket.on("chatListUpdated", () => {
      console.log("Chat list updated, refetching...");
=======
    socket.on(SocketEvents.CHAT_LIST_UPDATED, () => {
>>>>>>> main
      refetch();
    });

    return () => {
<<<<<<< HEAD
      socket.off("chatListUpdated");
    };
  }, []);

  return (
    <div className="w-full sm:w-80 border-r p-4 bg-white shadow-lg h-full flex flex-col">
      {/* Header */}
      <ChatHeader />

      {/* Chat Rooms List */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Loading...
        </div>
      ) : rooms.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-center">
          <div>
            <p className="text-lg font-medium mb-2">No chat rooms available</p>
            <p className="text-sm">Start a conversation to see it here.</p>
          </div>
        </div>
      ) : (
        <ul className="space-y-3 flex-1 overflow-y-auto mb-4">
          {rooms.map((room: ChatRoom) => (
            <li key={room._id}>
              <Link href={`/chat/${room._id}`}>
                <div className="p-4 bg-gray-100 hover:bg-blue-100 hover:text-blue-700 transition rounded-lg cursor-pointer shadow-sm">
                  <div className="font-semibold truncate text-gray-700">
                    {room.participants[0]?.name}
                  </div>
                  <div className="truncate text-sm text-gray-500">
                    {new Date(room.createdAt).toLocaleString()}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Explore Users Button */}
      <Link
        href="/explore"
        className="mt-4 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium shadow block"
      >
        + Explore Users
      </Link>
=======
      socket.off(SocketEvents.CHAT_LIST_UPDATED);
    };
  }, [refetch]);

  return (
    <div className="w-full h-full border-r border-[#2d3139] bg-[#0f1115] flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-[#2d3139]">
        <ChatHeader />
      </div>

      {/* Chat Rooms List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
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
                  <div className="group p-5 rounded-[1.5rem] bg-[#1a1d23]/40 hover:bg-[#1a1d23] transition-all duration-300 cursor-pointer border border-[#2d3139]/50 hover:border-indigo-500/30 relative overflow-hidden shadow-sm hover:shadow-indigo-500/5">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-center rounded-r-full" />
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-500/20 ring-2 ring-[#0f1115]">
                        {room.participants[0]?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="font-bold text-slate-100 truncate group-hover:text-indigo-400 transition-colors">
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

      {/* Explore Users Button */}
      <div className="p-6 border-t border-[#2d3139] bg-[#0f1115]">
        <Link
          href="/explore"
          className="flex items-center justify-center gap-3 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl transition-all duration-300 font-black shadow-xl shadow-indigo-900/40 group active:scale-[0.97] uppercase tracking-widest text-xs"
        >
          <span className="text-xl group-hover:rotate-180 transition-transform duration-500">＋</span>
          Discover People
        </Link>
      </div>
>>>>>>> main
    </div>
  );
}
