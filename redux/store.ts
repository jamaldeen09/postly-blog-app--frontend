"use client"
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import triggersSlice from "./slices/triggersSlice"
import userSlice from "./slices/userSlice";
import { authApi } from "./apis/authApi";
import profileApi from "./apis/profileApi";
import blogPostSlice from "./slices/blogPostsSlice"
import blogPostApi from "./apis/blogPostApi";
import commentsSlice from "./slices/commentsSlice"


const store = configureStore({
    reducer: {
        triggers: triggersSlice,
        user: userSlice,
        blogPosts: blogPostSlice,
        comments: commentsSlice,
        [authApi.reducerPath]: authApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
        [blogPostApi.reducerPath]: blogPostApi.reducer,
    },
    
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware()
           .concat(authApi.middleware)
           .concat(profileApi.middleware)
           .concat(blogPostApi.middleware)
});


type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export { store, useAppDispatch, useAppSelector, type RootState, type AppDispatch }