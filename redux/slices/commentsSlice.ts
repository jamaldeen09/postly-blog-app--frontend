import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Comment {
    _id: string;
    blogPost: string;
    likes: number;
    content: string;
    isLikedByCurrentUser: boolean;
    author: { _id: string; username: string; };
    type: "text";
    createdAt: string;
    updatedAt: string;
}


const initialState: { comments: Comment[] } = { 
    comments: [], 
}

// ** Actual slice ** \\
const commentsSlice = createSlice({
    initialState,
    name: "comments",
    reducers: {
        getInitialComments: (state, action: PayloadAction<Comment[]>) => {
            state.comments = action.payload
        },

        getMoreComments: (state, action: PayloadAction<Comment[]>) => {
            const receivedComments = action.payload;
            if (receivedComments.length <= 0) return;

            const conjoinedComments = [...state.comments, ...receivedComments];
            const commentsMap: Map<string, Comment> = new Map();

            for (const comment of conjoinedComments) {
                commentsMap.set(comment._id, comment);
            };

            state.comments = Array.from(commentsMap.values());
        },
        likeOrUnlikeNewComment: (state, action: PayloadAction<{ commentId: string; }>) => {
            const commentBeingLikedOrUnliked = state.comments.find((comment) => comment._id === action.payload.commentId);
            if (!commentBeingLikedOrUnliked) return;

            commentBeingLikedOrUnliked.likes = commentBeingLikedOrUnliked.isLikedByCurrentUser ? commentBeingLikedOrUnliked.likes - 1 : commentBeingLikedOrUnliked.likes + 1;
            commentBeingLikedOrUnliked.isLikedByCurrentUser = !commentBeingLikedOrUnliked.isLikedByCurrentUser

        }   
    }
});

export const { getInitialComments, getMoreComments, likeOrUnlikeNewComment } = commentsSlice.actions
export { type Comment }
export default commentsSlice.reducer;
