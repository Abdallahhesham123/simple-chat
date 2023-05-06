import { configureStore ,combineReducers} from "@reduxjs/toolkit";
// import postReducer from "./postReducer/PostSlice.js";
import Authreducer from "./AuthSlice/user.js";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
const persistConfig = { key: "root", storage, version: 1 };
const reducer=combineReducers({

// posts:postReducer,
auth:Authreducer
})
const persistedReducer = persistReducer(persistConfig, reducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
