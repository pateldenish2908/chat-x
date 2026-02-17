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
  tagTypes: ["ChatRooms", "ChatRequests"],
  endpoints: (builder) => ({
    // 💬 Get my chat rooms
    getChatRooms: builder.query({
      query: () => `chat-rooms/my-chat-rooms`,
      providesTags: ["ChatRooms"],
    }),

    // 🆕 Create or get chat room
    createOrGetChatRoom: builder.mutation<ChatRoom, CreateChatRoomRequest>({
      query: (body) => ({
        url: "chat-rooms/create-or-get",
        method: "POST",
        body,
      }),
    }),

    // 💌 Chat Requests
    sendChatRequest: builder.mutation({
      query: (receiverId: string) => ({
        url: "chat-requests/send",
        method: "POST",
        body: { receiverId },
      }),
      invalidatesTags: ["ChatRequests"],
    }),

    respondToChatRequest: builder.mutation({
      query: (payload: { requestId: string; status: 'accepted' | 'declined' }) => ({
        url: "chat-requests/respond",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ChatRequests", "ChatRooms"],
    }),

    getMyChatRequests: builder.query({
      query: () => "chat-requests/my-requests",
      providesTags: ["ChatRequests"],
      transformResponse: (response: any) => response.data,
    }),
    // 📖 Chat History
    getMessages: builder.query({
      query: (otherUserId) => `messages/${otherUserId}`,
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const {
  useGetChatRoomsQuery,
  useCreateOrGetChatRoomMutation,
  useSendChatRequestMutation,
  useRespondToChatRequestMutation,
  useGetMyChatRequestsQuery,
  useGetMessagesQuery,
} = chatApiSlice;
