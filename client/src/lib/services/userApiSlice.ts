import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./customBaseQuery";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  data: {
    _id: string;
    name: string;
    email: string;
  };
}

interface NearbyUser {
  _id: string;
  name: string;
  profileImage?: string;
  distance?: number;
  gender?: string;
  bio?: string;
}

export const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Users", "NearbyUsers", "Blocks"],
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => "users/me",
      providesTags: ["Users"],
    }),

    updateMe: builder.mutation({
      query: (userData) => ({
        url: "users/me",
        method: "PATCH",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),

    register: builder.mutation({
      query: (userData) => ({
        url: "auth/register",
        method: "POST",
        body: userData,
      }),
    }),

    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
    }),

    // ✅ Discovery
    getNearbyUsers: builder.query<
      NearbyUser[],
      { latitude: number; longitude: number; radius?: number; page?: number; limit?: number }
    >({
      query: (params) => ({
        url: `discover`,
        params,
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["NearbyUsers"],
    }),

    // 🚫 Blocking
    blockUser: builder.mutation({
      query: (blockedId: string) => ({
        url: "blocks/block",
        method: "POST",
        body: { blockedId },
      }),
      invalidatesTags: ["NearbyUsers", "Blocks"],
    }),

    unblockUser: builder.mutation({
      query: (blockedId: string) => ({
        url: "blocks/unblock",
        method: "POST",
        body: { blockedId },
      }),
      invalidatesTags: ["NearbyUsers", "Blocks"],
    }),

    getBlockedUsers: builder.query({
      query: () => "blocks",
      transformResponse: (response: any) => response.data,
      providesTags: ["Blocks"],
    }),

    // 🚩 Reporting
    reportUser: builder.mutation({
      query: (reportData: { reportedId: string; reason: string; description?: string }) => ({
        url: "reports",
        method: "POST",
        body: reportData,
      }),
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateMeMutation,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetNearbyUsersQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
  useGetBlockedUsersQuery,
  useReportUserMutation,
} = userApiSlice;
