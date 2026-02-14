"use client";
import React from "react";
import { useParams } from "next/navigation";
import ChatWindow from "@/app/components/ChatWindow";
import { getCurrentUser } from "@/utils/getCurrentUser";

export default function ChatRoomPage() {
  const params = useParams<{ roomId: string }>();
  const user = getCurrentUser();
  return <ChatWindow roomId={params.roomId} user={user} />;
}
