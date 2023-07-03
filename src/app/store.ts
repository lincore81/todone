import { combineReducers, configureStore } from '@reduxjs/toolkit';
import todoReducer from "@/features/todo/slice";
import trackerReducer, { TrackerState } from "@/features/tracker/slice";
import { persistStore, persistReducer, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

const pauseTransform: any = createTransform<unknown, any, RootState>(
  // serialise
  (state: unknown, _: string|number|symbol) => state,
  // deserialise
  (state: TrackerState, key: string|number|symbol) => {
    return key === "tracker" ? {
      ...state,
      mode: state.mode === "running" ? "paused" : state.mode
    } : state;
  },
  {whitelist: ['tracker']}
);


const persistConfig = { 
  key: 'root', 
  storage, 
  transforms: [pauseTransform]
};
const rootReducer = combineReducers({ 
  todo: todoReducer,
  tracker: trackerReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk]
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch