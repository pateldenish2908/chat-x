"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { socket } from "@/utils/socket";
import { Message, User } from "@/types";
import { useGetMessagesByRoomIdQuery } from "@/lib/services/chatApiSlice";
import { useCall } from "@/lib/CallContext";
import { SocketEvents } from "@/constants/socketEvents";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

interface Props {
  roomId: string;
  user: User;
}

export default function ChatWindow({ roomId, user }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
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

    const onReceive = (msg: Message) => {
      if (msg.chatRoom === roomId) {
        setMessages((prev) => [...prev, msg]);
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
    } catch { }
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
      chatRoom: roomId,
      senderId: user._id,
      content,
    });
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
    <div className="flex flex-col h-full bg-[#0f1115] overflow-hidden w-full transition-all duration-500">
      <ChatHeader
        roomId={roomId}
        onAudioCall={() => handleCall('audio')}
        onVideoCall={() => handleCall('video')}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 custom-scrollbar bg-transparent">
        {isLoading ? (
          <div className="flex h-full items-center justify-center space-x-3">
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" />
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-slate-500 bg-[#1a1d23]/30 rounded-[2rem] sm:rounded-[3rem] border-2 border-dashed border-[#2d3139] m-4 sm:m-6">
            <div className="text-center p-6">
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-6 grayscale opacity-50">🛰️</div>
              <div className="text-lg sm:text-xl font-black text-slate-400 uppercase tracking-widest">Encrypted Direct Line</div>
              <p className="text-xs sm:text-sm font-medium mt-2">Send a pulse to start communication</p>
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
          </div>
        )}
      </div>

      <ChatInput onSendMessage={sendMessage} onTyping={handleTyping} />
    </div>
  );
}
