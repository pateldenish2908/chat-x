import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { socket } from "@/utils/socket";
import { Message, User } from "@/types";
import { SocketEvents } from "@/constants/socketEvents";
import { getMessages, saveMessage, updateMessageStatus } from "@/utils/persistence.util";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from 'uuid';
import { useGetMessagesQuery, useGetChatRoomsQuery } from "@/lib/services/chatApiSlice";

interface Props {
  roomId: string;
  user: User;
}

export default function ChatWindow({ roomId, user }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get the other user's ID from the room's participants
  const { data: chatRooms } = useGetChatRoomsQuery(undefined);
  const otherUserId = useMemo(() => {
    if (!chatRooms || !user?._id) return null;
    const room = chatRooms.find((r: any) => r._id === roomId);
    if (!room) return null;
    const other = room.participants.find((p: any) => {
      const pid = typeof p === 'object' ? p._id : p;
      return pid !== user._id;
    });
    return typeof other === 'object' ? other?._id : other;
  }, [chatRooms, roomId, user?._id]);

  const otherUserName = useMemo(() => {
    if (!chatRooms || !user?._id) return 'Chat';
    const room = chatRooms.find((r: any) => r._id === roomId);
    if (!room) return 'Chat';
    const other = room.participants.find((p: any) => {
      const pid = typeof p === 'object' ? p._id : p;
      return pid !== user._id;
    });
    return typeof other === 'object' ? other?.name : 'Chat';
  }, [chatRooms, roomId, user?._id]);

  const { data: dbMessages, isLoading: isFetchingHistory } = useGetMessagesQuery(roomId, {
    skip: !roomId,
  });

  // Initialize messages from DB and LocalStorage
  useEffect(() => {
    if (dbMessages) {
      setMessages(dbMessages);
      localStorage.setItem(`messages_${roomId}`, JSON.stringify(dbMessages));
    } else {
      const history = getMessages(roomId);
      setMessages(history);
    }
  }, [dbMessages, roomId]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    const onReceive = (msg: any) => {
      setMessages((prev) => {
        // Avoid duplicate (optimistic message already added)
        if (prev.some(m => m.messageId === msg.messageId)) {
          return prev.map(m => m.messageId === msg.messageId ? { ...m, ...msg } : m);
        }
        const newMessages = [...prev, msg];
        saveMessage(roomId, msg);
        return newMessages;
      });

      const senderId = typeof msg.sender === 'object' ? msg.sender?._id : (msg.senderId || msg.sender);
      if (senderId !== user._id) {
        playMessageSound();
        setIsTyping(false);
        socket.emit(SocketEvents.MESSAGE_READ, {
          messageId: msg.messageId,
          senderId,
        });
      }
    };

    const onStatusUpdate = (data: { messageId: string, status: string }) => {
      setMessages((prev) => {
        const updated = prev.map(m => m.messageId === data.messageId ? { ...m, status: data.status as any } : m);
        updateMessageStatus(roomId, data.messageId, data.status as "sent" | "delivered" | "read");
        return updated;
      });
    };

    const onTypingStarted = (data: { senderId: string }) => {
      if (data.senderId !== user._id) setIsTyping(true);
    };

    const onTypingStopped = (data: { senderId: string }) => {
      if (data.senderId !== user._id) setIsTyping(false);
    };

    socket.on(SocketEvents.RECEIVE_MESSAGE, onReceive);
    socket.on(SocketEvents.MESSAGE_SENT, onStatusUpdate);
    socket.on(SocketEvents.MESSAGE_DELIVERED, onStatusUpdate);
    socket.on(SocketEvents.MESSAGE_READ, onStatusUpdate);
    socket.on(SocketEvents.TYPING_STARTED, onTypingStarted);
    socket.on(SocketEvents.TYPING_STOPPED, onTypingStopped);

    return () => {
      socket.off(SocketEvents.RECEIVE_MESSAGE, onReceive);
      socket.off(SocketEvents.MESSAGE_SENT, onStatusUpdate);
      socket.off(SocketEvents.MESSAGE_DELIVERED, onStatusUpdate);
      socket.off(SocketEvents.MESSAGE_READ, onStatusUpdate);
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
    if (!otherUserId) return; // Can't emit typing without knowing the receiver
    if (typing) {
      socket.emit(SocketEvents.TYPING_START, { receiverId: otherUserId });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit(SocketEvents.TYPING_STOP, { receiverId: otherUserId });
      }, 2000);
    } else {
      socket.emit(SocketEvents.TYPING_STOP, { receiverId: otherUserId });
    }
  }, [otherUserId]);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return;
    const messageId = uuidv4();

    const tempMsg: Message = {
      messageId,
      chatRoom: roomId,
      sender: user._id,
      content,
      status: 'sent',
      createdAt: new Date().toISOString(),
    };

    // Optimistic update
    setMessages((prev) => [...prev, tempMsg]);
    saveMessage(roomId, tempMsg);

    // Emit with correct roomId (NOT receiverId)
    socket.emit(SocketEvents.SEND_MESSAGE, {
      messageId,
      roomId,      // ✅ Critical: server uses this to find the chat room
      content,
    });

    // Stop typing indicator on send
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (otherUserId) {
      socket.emit(SocketEvents.TYPING_STOP, { receiverId: otherUserId });
    }
  }, [roomId, user._id, otherUserId]);

  const renderedMessages = useMemo(() => (
    messages.map((msg, index) => (
      <MessageBubble
        key={msg.messageId || index}
        message={msg}
        isOwn={(typeof msg.sender === 'object' ? (msg.sender as any)?._id : msg.sender) === user._id}
      />
    ))
  ), [messages, user._id]);

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden w-full transition-all duration-300">
      <ChatHeader roomId={roomId} otherUserName={otherUserName} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 space-y-6 custom-scrollbar bg-transparent">
        {isFetchingHistory ? (
          <div className="flex h-full items-center justify-center space-x-2">
            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0s]" />
            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center m-4 sm:m-10">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 bg-[#f3f3f2] rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto">💬</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Private conversation</h3>
              <p className="text-sm text-[#6e6e6a] leading-relaxed">
                Messages are end-to-end encrypted and synced across your devices.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {renderedMessages}
            <div ref={messagesEndRef} />
            {isTyping && (
              <div className="flex items-center gap-2 text-[11px] text-[#6e6e6a] font-medium bg-[#f3f3f2] w-fit px-4 py-2 rounded-full border border-border">
                <div className="flex gap-1">
                  <span className="w-1 h-1 bg-[#a3a3a0] rounded-full animate-bounce" />
                  <span className="w-1 h-1 bg-[#a3a3a0] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1 h-1 bg-[#a3a3a0] rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                Typing...
              </div>
            )}
          </div>
        )}
      </div>

      <ChatInput onSendMessage={sendMessage} onTyping={handleTyping} />
    </div>
  );
}
