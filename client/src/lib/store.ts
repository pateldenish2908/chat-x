import { configureStore } from "@reduxjs/toolkit";
import { chatApiSlice } from "./services/chatApiSlice";
import { userApiSlice } from "./services/userApiSlice";
import authSlice from "./authSlice";

export const makeStore = configureStore({
  reducer: {
    [chatApiSlice.reducerPath]: chatApiSlice.reducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    auth: authSlice.reducer, // Add authSlice to the store
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      chatApiSlice.middleware,
      userApiSlice.middleware
    ),
});

// Infer the type of makeStore
export type AppStore = typeof makeStore;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
