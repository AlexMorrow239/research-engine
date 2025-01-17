import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import projectsReducer from "./features/projects/projectsSlice";
import authReducer from "./features/auth/authSlice";
import uiReducer from "./features/ui/uiSlice";
import { errorMiddleware } from "./middleware/errorMiddleWare";
import { AuthState, UIState } from "@/types/global";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "user"], // Only persist these fields
};

const uiPersistConfig = {
  key: "ui",
  storage,
  whitelist: ["theme", "sidebar"], // Only persist these fields
};

// Create properly typed persisted reducers
const persistedAuthReducer = persistReducer<AuthState>(
  authPersistConfig,
  authReducer
);

const persistedUiReducer = persistReducer<UIState>(uiPersistConfig, uiReducer);

const store = configureStore({
  reducer: {
    projects: projectsReducer,
    auth: persistedAuthReducer,
    ui: persistedUiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(errorMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
