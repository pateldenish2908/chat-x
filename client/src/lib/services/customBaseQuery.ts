// services/baseQueryWithReauth.ts
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  // baseUrl: 'http://localhost:5000/api',
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: 'include', // sends cookies
});

export const baseQueryWithReauth: typeof baseQuery = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // Try to refresh the token
    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh-token',
        method: 'POST',
      },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      // Retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Optionally clear user state or redirect to login
      console.warn('Refresh failed. Logging out user...');
    }
  }

  return result;
};
