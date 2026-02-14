// services/api.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./customBaseQuery";



interface SendMessagePayload {
  chatRoom: string;
  senderId: string;
  content: string;
}

interface ChatRoom {
  _id: string;
  participants: {
    _id: string;
    name: string;
    email: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface CreateChatRoomRequest {
  userId1: string;
  userId2: string;
}

export const chatApiSlice = createApi({
  reducerPath: "chatApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Users", "ChatRooms", "Messages", "NearbyUsers"],
  endpoints: (builder) => ({
    // 💬 Get all chat rooms for a user
    getChatRooms: builder.query({
      query: (userId: string) => `chat-rooms/my-chat-rooms/${userId}`,
      // providesTags: ["ChatRooms"],
    }),

    // 💌 Get messages in a room
    getMessagesByRoomId: builder.query({
      query: (roomId: string) => `messages/${roomId}`,
      providesTags: (result, error, roomId) => [
        { type: "Messages", id: roomId },
      ],
    }),

    // 📨 Send a new message
    sendMessage: builder.mutation({
      query: (body: SendMessagePayload) => ({
        url: "messages",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Messages", id: arg.chatRoom },
      ],
    }),
    // 🆕 Create or get chat room
    createOrGetChatRoom: builder.mutation<ChatRoom, CreateChatRoomRequest>({
      query: (body) => ({
        url: "/chat-rooms/create-or-get",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetChatRoomsQuery,
  useGetMessagesByRoomIdQuery,
  useSendMessageMutation,
  useCreateOrGetChatRoomMutation,
} = chatApiSlice;
