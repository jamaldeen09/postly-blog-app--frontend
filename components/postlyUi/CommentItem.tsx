"use client"
import { Comment } from "@/redux/slices/commentsSlice";
import { Heart } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import CustomSpinner from "../reusableUi/CustomSpinner";
import { useAppSelector } from "@/redux/store";

const formatTimeAgo = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();

    const hoursAgo = Math.floor(diffInMs / (1000 * 60 * 60));
    const daysAgo = Math.floor(hoursAgo / 24);
    const weeksAgo = Math.floor(daysAgo / 7);
    const monthsAgo = Math.floor(daysAgo / 30);

    if (hoursAgo < 1) {
        const minutesAgo = Math.floor(diffInMs / (1000 * 60));
        return minutesAgo < 1 ? 'just now' : `${minutesAgo}m ago`;
    }
    if (hoursAgo < 24) return `${hoursAgo}h ago`;
    if (daysAgo < 7) return `${daysAgo}d ago`;
    if (weeksAgo < 4) return `${weeksAgo}w ago`;
    return `${monthsAgo}mo ago`;
};

interface CommentItemProps {
    comment: Comment,
    onCommentLike: (commentBeingLikedOrUnliked: string) => void,
    commentBeingLikedOrUnliked: string;
    isLikingOrUnlikingComment: boolean
}

const CommentItem = React.memo((props: CommentItemProps) => {
    const profile = useAppSelector((state) => state.user.profile)
    return (
        <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center text-xs">
                {props.comment.author.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
                <div className="bg-gray-100 rounded-lg p-3 border-l-4 border-gray-300">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-medium text-gray-900 wrap-break-word">{props.comment.author.username}</span>
                        <span className="text-xs text-gray-500 shrink-0">• {formatTimeAgo(props.comment.createdAt)}</span>
                    </div>
                    <p className="text-gray-700 text-sm wrap-break-word">{props.comment.content}</p>
                </div>
                <div className="flex items-center gap-2 mt-1 px-1">
                    {profile._id !== props.comment.author._id && (
                        <Button
                            disabled={props.isLikingOrUnlikingComment}
                            onClick={() => props.onCommentLike(props.commentBeingLikedOrUnliked)}
                            variant="ghost"
                            size="icon-sm"
                            className={`cursor-pointer w-6 h-6 ${props.comment.isLikedByCurrentUser && "hover:bg-red-100"}`}
                        >
                            {props.isLikingOrUnlikingComment && props.comment._id === props.commentBeingLikedOrUnliked ? (
                                <CustomSpinner className="text-red-600" />
                            ) : (
                                <Heart fill={`
                                    ${props.comment.isLikedByCurrentUser ? "oklch(57.7% 0.245 27.325)" : "#6a7282"}`
                                } stroke="none" className="size-4" />
                            )}
                        </Button>
                    )}
                    <p
                        className="text-xs text-gray-500 hover:text-gray-700 shrink-0">
                        {props.comment.likes === 1 ? "Like" : "Likes"} ({props.comment.likes})
                    </p>
                </div>
            </div>
        </div>
    );
});

export { CommentItem, formatTimeAgo }