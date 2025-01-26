import type { AuthState, UIState } from "@/types";
import { configureStore } from "@reduxjs/toolkit";
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import applicationsReducer from "./features/applications/applicationsSlice";
import authReducer from "./features/auth/authSlice";
import projectsReducer from "./features/projects/projectsSlice";
import uiReducer from "./features/ui/uiSlice";
import { authMiddleware } from "./middleware/authMiddleware";
import { errorMiddleware } from "./middleware/errorMiddleWare";

const applicationsPersistConfig = {
  key: "applications",
  storage,
  whitelist: ["filters", "currentApplication"], // Only persist these fields
};

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["accessToken", "user", "isAuthenticated"],
};

const uiPersistConfig = {
  key: "ui",
  storage,
  whitelist: ["theme", "sidebar"],
};

const persistedApplicationsReducer = persistReducer(
  applicationsPersistConfig,
  applicationsReducer
);

const persistedAuthReducer = persistReducer<AuthState>(
  authPersistConfig,
  authReducer
);

const persistedUiReducer = persistReducer<UIState>(uiPersistConfig, uiReducer);

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    auth: persistedAuthReducer,
    ui: persistedUiReducer,
    applications: persistedApplicationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(errorMiddleware, authMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
