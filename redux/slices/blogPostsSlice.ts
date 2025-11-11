import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface BlogPost {
    _id: string;
    isLikedByCurrentUser: boolean;
    author: { _id: string; username: string };
    category: string;
    title: string;
    content: string;
    comments: number;
    likes: number;
    views: number;
    createdAt: string;
    updatedAt: string;
    isArchived: boolean,
}

interface PaginationData<T> {
    offset: number;
    page: number;
    limit: number;
    totalPages: number;   
    data: T;
}


const initialState: { blogPosts: BlogPost[] } = {
    blogPosts: []
};

const blogPostsSlice = createSlice({
    name: "blogPosts",
    initialState,
    reducers: {
        getBlogPosts: (state, action: PayloadAction<BlogPost[]>) => {
            state.blogPosts = action.payload
        },

        setBlogPostLikes: (state, action: PayloadAction<{ postId: string, likes: number}>) => {
            const blogPostBeingUpdated = state.blogPosts.find((post) => post._id === action.payload.postId);
            if (!blogPostBeingUpdated) return;

            blogPostBeingUpdated.likes = action.payload.likes
            blogPostBeingUpdated.isLikedByCurrentUser = !blogPostBeingUpdated.isLikedByCurrentUser
        },

        newPostView: (state, action: PayloadAction<{ postId: string; currentUsersId: string }>) => {
            const postBeingViewed = state.blogPosts.find((post) => post._id === action.payload.postId);
            if (!postBeingViewed) return;
            if (postBeingViewed.author._id === action.payload.currentUsersId) return;

            postBeingViewed.views = postBeingViewed.views += 1
        },
    }
});

export const {  getBlogPosts,  newPostView, setBlogPostLikes } = blogPostsSlice.actions;
export { type BlogPost, type PaginationData }
export default blogPostsSlice.reducer;
