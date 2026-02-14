import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./customBaseQuery";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

interface NearbyUser {
  _id: string;
  name: string;
  avatar: string;
  distance: number;
}

export const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ page, pageSize, search, sortField, sortOrder }) => ({
        url: "users",
        params: { page, pageSize, search, sortField, sortOrder },
      }),
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
        url: "/auth/logout",
        method: "POST",
        credentials: "include",
      }),
    }),

    // ✅ New Nearby Users Query
    getNearbyUsers: builder.query<
      NearbyUser[],
      { latitude: number; longitude: number; userId: string }
    >({
      query: ({ latitude, longitude, userId }) => ({
        url: `users/nearby`,
        params: { latitude, longitude, userId },
      }),
      transformResponse: (response: { users: NearbyUser[] }) =>
        response.users.map((u) => ({
          _id: u._id,
          name: u.name,
          avatar: u.avatar || "https://mui.com/static/images/avatar/1.jpg",
          distance: u.distance,
        })),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetNearbyUsersQuery,
} = userApiSlice;
