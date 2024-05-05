import { combineReducers, configureStore  } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { thunk } from "redux-thunk";
import userReducer from "./userSlice";
import postsReducer from "./postSlice";


const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({
  user: userReducer, 
  posts: postsReducer 
})
const persistedReducer = persistReducer(persistConfig,rootReducer)

export const store = configureStore({
  reducer: persistedReducer,

  devTools: process.env.NODE_ENV !== 'production',
  // middleware: [thunk]
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [],
      ignoredPaths: ['store', 'firestore'],
    },
    thunk: {
    },
  }).concat(thunk),
})

export const persistor = persistStore(store)