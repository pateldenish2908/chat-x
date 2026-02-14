"use client";

<<<<<<< HEAD
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { socket } from "@/utils/socket";
import { Message, User } from "@/types";
import { useGetMessagesByRoomIdQuery } from "@/lib/services/chatApiSlice";
=======
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { socket } from "@/utils/socket";
import { Message, User } from "@/types";
import { useGetMessagesByRoomIdQuery } from "@/lib/services/chatApiSlice";
import { useCall } from "@/lib/CallContext";
import { SocketEvents } from "@/constants/socketEvents";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
>>>>>>> main

interface Props {
  roomId: string;
  user: User;
}

export default function ChatWindow({ roomId, user }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
<<<<<<< HEAD
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { data: fetchedMessages = [], isLoading } =
    useGetMessagesByRoomIdQuery(roomId);

  useEffect(() => {
    if (fetchedMessages.length === 0) return;
    setMessages(fetchedMessages);
  }, [fetchedMessages]);

  useEffect(() => {
    socket.emit("join", { roomId });
=======
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { callUser } = useCall();
  const { data: fetchedMessages = [], isLoading } = useGetMessagesByRoomIdQuery(roomId);

  // Initialize messages from fetch
  useEffect(() => {
    if (fetchedMessages.length > 0) {
      setMessages(fetchedMessages);
    }
  }, [fetchedMessages]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    socket.emit(SocketEvents.JOIN, { roomId });
>>>>>>> main

    const onReceive = (msg: Message) => {
      if (msg.chatRoom === roomId) {
        setMessages((prev) => [...prev, msg]);
<<<<<<< HEAD
      }
    };

    socket.on("receiveMessage", onReceive);

    return () => {
      socket.emit("leave", { roomId });
      socket.off("receiveMessage", onReceive);
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const content = input.trim();
    if (!content) return;

    socket.emit("sendMessage", {
=======
        if (msg.sender?._id !== user._id) {
          playMessageSound();
          setIsTyping(false);
        }
      }
    };

    const onTypingStarted = (typingUser: User) => {
      if (typingUser._id !== user._id) setIsTyping(true);
    };

    const onTypingStopped = (typingUser: User) => {
      if (typingUser._id !== user._id) setIsTyping(false);
    };

    socket.on(SocketEvents.RECEIVE_MESSAGE, onReceive);
    socket.on(SocketEvents.TYPING_STARTED, onTypingStarted);
    socket.on(SocketEvents.TYPING_STOPPED, onTypingStopped);

    return () => {
      socket.emit(SocketEvents.LEAVE, { roomId });
      socket.off(SocketEvents.RECEIVE_MESSAGE, onReceive);
      socket.off(SocketEvents.TYPING_STARTED, onTypingStarted);
      socket.off(SocketEvents.TYPING_STOPPED, onTypingStopped);
    };
  }, [roomId, user._id]);

  const playMessageSound = () => {
    try {
      const audio = new Audio("https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3");
      audio.volume = 0.4;
      audio.play().catch(() => { });
    } catch (e) { }
  };

  const handleTyping = useCallback((typing: boolean) => {
    if (typing) {
      socket.emit(SocketEvents.TYPING, { roomId, user });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit(SocketEvents.STOP_TYPING, { roomId, user });
      }, 2000);
    } else {
      // Explicit stop typing if needed, though timeout handles most
    }
  }, [roomId, user]);

  const handleCall = useCallback((type: 'video' | 'audio') => {
    const otherUserMsg = messages.find(m => m.sender?._id !== user._id);
    if (otherUserMsg) {
      callUser(otherUserMsg.sender._id, type);
    } else {
      alert("Please send a message first to establish a connection with the participant!");
    }
  }, [messages, user._id, callUser]);

  const sendMessage = useCallback((content: string) => {
    if (!content) return;
    socket.emit(SocketEvents.SEND_MESSAGE, {
>>>>>>> main
      chatRoom: roomId,
      senderId: user._id,
      content,
    });
<<<<<<< HEAD

    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-md overflow-hidden w-full">
      {/* Header */}
      <div className="p-4 bg-blue-600 text-white font-semibold text-lg shadow flex justify-between items-center">
        <div>
          Chat Room: <span className="text-sm font-normal">{roomId}</span>
        </div>
        <Link href="/chat">
          <span
            className="text-white hover:text-blue-200 text-xl cursor-pointer"
            title="Close"
          >
            ✖
          </span>
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-lg font-semibold">No messages yet</div>
              <div className="text-sm">Start the conversation 👋</div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => {
              const isOwn = msg.sender?._id === user._id;
              return (
                <div
                  key={index}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md p-3 rounded-2xl shadow ${
                      isOwn
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">
                      {msg?.message}
                    </div>
                    <div
                      className={`text-xs mt-1 text-right ${
                        isOwn ? "text-blue-200" : "text-gray-500"
                      }`}
                    >
                      {msg.createdAt &&
                        new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
=======
  }, [roomId, user._id]);

  const renderedMessages = useMemo(() => (
    messages.map((msg, index) => (
      <MessageBubble
        key={msg._id || index}
        message={msg}
        isOwn={msg.sender?._id === user._id}
      />
    ))
  ), [messages, user._id]);

  return (
    <div className="flex flex-col h-full bg-[#0f1115] shadow-2xl overflow-hidden w-full transition-all duration-500">
      <ChatHeader
        roomId={roomId}
        onAudioCall={() => handleCall('audio')}
        onVideoCall={() => handleCall('video')}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-transparent">
        {isLoading ? (
          <div className="flex h-full items-center justify-center space-x-3">
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" />
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-slate-500 bg-[#1a1d23]/30 rounded-[3rem] border-2 border-dashed border-[#2d3139] m-6">
            <div className="text-center">
              <div className="text-5xl mb-6 grayscale opacity-50">🛰️</div>
              <div className="text-xl font-black text-slate-400 uppercase tracking-widest">Encrypted Direct Line</div>
              <p className="text-sm font-medium mt-2">Send a pulse to start communication</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {renderedMessages}
            <div ref={messagesEndRef} />
            {isTyping && (
              <div className="flex items-center gap-3 text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em] bg-[#1a1d23]/80 w-fit px-5 py-2.5 rounded-full border border-indigo-500/20 shadow-lg animate-pulse">
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                Receiving Input
              </div>
            )}
>>>>>>> main
          </div>
        )}
      </div>

<<<<<<< HEAD
      {/* Input */}
      <div className="p-4 border-t bg-white flex items-center gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-gray-800 placeholder-gray-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
=======
      <ChatInput onSendMessage={sendMessage} onTyping={handleTyping} />
>>>>>>> main
    </div>
  );
}
