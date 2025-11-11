import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "../apis/authApi";
import { BlogPost } from "./blogPostsSlice";

// ** Types ** \\
interface AuthState {
    username: string;
    userId: string;
    isAuthenticated: boolean;
}

interface Profile {
    _id: "",
    email: string;
    username: string;
    createdBlogPosts: BlogPost[];
    likedBlogPosts: BlogPost[];
    archivedBlogPosts: BlogPost[];
    createdAt: string;
    updatedAt: string;
}


interface User {
    profile: Profile
    authState: AuthState
}

// ** Initial state ** \\
const initialState: User = {
    profile: {
        _id: "",
        username: "",
        email: "",
        createdBlogPosts: [],
        likedBlogPosts: [],
        archivedBlogPosts: [],
        createdAt: "",
        updatedAt: "",
    },
    authState: {
        username: "",
        userId: "",
        isAuthenticated: false,
    },
}

// ** Actual slice ** \\
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<Omit<AuthState, "isAuthenticated">>) => {
            state.authState = { ...action.payload, isAuthenticated: true }
        },

        logout: (state) => {
            state.authState = {
                isAuthenticated: false,
                userId: "",
                username: "",
            }

            state.profile = {
                _id: "",
                username: "",
                createdBlogPosts: [],
                createdAt: "",
                updatedAt: "",
                email: "",
                likedBlogPosts: [],
                archivedBlogPosts: [],
            };


            if (typeof window !== "undefined") {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("userAuth");
            }
        },

        setProfile: (state, action: PayloadAction<Omit<User["profile"], "createdBlogPosts">>) => {
            state.profile = { ...action.payload, createdBlogPosts: [] };
        },

        fetchBlogPosts: (state, action: PayloadAction<{
            blogPosts: BlogPost[],
            postType: "createdBlogPosts" | "likedBlogPosts" | "archivedBlogPosts"
        }>) => {
            state.profile[action.payload.postType] = action.payload.blogPosts
        },

        updatePostView: (state, action: PayloadAction<{
            postId: string;
            postType: "likedBlogPosts" | "createdBlogPosts";
            currentUserId: string;
        }>) => {
            const blogPost = state.profile[action.payload.postType].find((post) => post._id === action.payload.postId);
            if (!blogPost) return;
            if (blogPost.author._id === action.payload.currentUserId) return;

            blogPost.views = blogPost.views += 1
        },
    },

    extraReducers: (builder) => {
        builder.addMatcher(
            authApi.endpoints.getAuthState.matchFulfilled,
            (state, action) => {
                const authData = (action.payload.data as { auth: Omit<AuthState, "isAuthenticated"> }).auth;
                state.authState = { ...authData, isAuthenticated: true }
            }
        );

        builder.addMatcher(
            authApi.endpoints.getAuthState.matchRejected,
            (state) => {
                state.authState = {
                    isAuthenticated: false,
                    userId: "",
                    username: "",
                };

                state.profile = {
                    _id: "",
                    username: "",
                    createdBlogPosts: [],
                    createdAt: "",
                    updatedAt: "",
                    email: "",
                    likedBlogPosts: [],
                    archivedBlogPosts: [],
                }
            }
        );
    },
})


// ** Exports ** \\
export {
    type User,
    type Profile,
    type AuthState,
}

export const { 
    setAuth, 
    logout, 
    setProfile, 
    fetchBlogPosts,
    updatePostView,
} = userSlice.actions;
export default userSlice.reducer