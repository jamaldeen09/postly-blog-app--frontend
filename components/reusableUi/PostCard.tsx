"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, ArrowRight, Archive, RotateCcw } from "lucide-react"
import { Button } from "../ui/button"
import { BlogPost } from "@/redux/slices/blogPostsSlice"
import { formatPostCreationDate } from "@/utils/helpers"
import { useAppSelector } from "@/redux/store"
import CustomToolTip from "./CustomTooltip"
import CustomSpinner from "./CustomSpinner"

interface PostCardProps {
  post: BlogPost;
  isLikingPost: boolean;
  postBeingLiked: string;
  postBeingViewed?: string;
  onLike: (id: string) => void;
  onPostView?: (id: string) => void;
  postBeingUnarchived: string;
  isArchivingOrUnarchivingBlogPost: boolean;
  onUnarchivePost: (id: string) => void;
  onPostArchive: (id: string) => void;
  onCommentRequests?: () => void;
}

interface PostCardActionButtonProps {
  variant: "default" | "destructive" | "ghost" | "link" | "outline" | "secondary";
  size: "sm" | "lg" | "icon-sm" | "icon-lg" | "icon" | "default";
  className?: string;
  buttonIcon: React.ReactElement;
  buttonValue?: number;
  funcToExecuteOnButtonClick?: (postId: string) => void;
  postId?: string;
  disabled?: boolean;
  tooltipContent?: string;
};


export const formatViewCount = (count: number): string => {
  if (count < 1000) {
    return count.toString();
  } else if (count < 1000000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  } else {
    return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
};

const PostCardActionButton = (props: PostCardActionButtonProps): React.ReactElement => {

  return (
    <div className="flex items-center gap-1">
      {props.tooltipContent ? (
        <CustomToolTip
          content={props.tooltipContent || ""}
        >
          <Button
            disabled={props.disabled}
            onClick={() => {
              if (props.funcToExecuteOnButtonClick) {
                return props.funcToExecuteOnButtonClick(props.postId || crypto.randomUUID())
              }
            }}
            variant={props.variant || "default"}
            size={props.size || "default"}
            className={`${props.className} h-8 px-2 cursor-pointer`}
          >
            {props.buttonIcon}
            {props.buttonValue && (<span className="text-sm ml-1">{props.buttonValue}</span>)}
          </Button>
        </CustomToolTip>
      ) : (
        <Button
          disabled={props.disabled}
          variant={props.variant || "default"}
          size={props.size || "default"}
          className={`${props.className} h-8 px-2 cursor-pointer`}
        >
          {props.buttonIcon}
          {props.buttonValue && (<span className="text-sm ml-1">{props.buttonValue}</span>)}
        </Button>
      )}
    </div>
  )
};

const PostCard = ({
  post,
  onLike,
  postBeingUnarchived,
  onUnarchivePost,
  isArchivingOrUnarchivingBlogPost,
  isLikingPost,
  postBeingLiked,
  onPostArchive,
  onPostView,
  postBeingViewed,
}: PostCardProps) => {
  const userId = useAppSelector((state) => state.user.profile._id);
  const isCreator = userId === post.author._id;
  return (
    <Card className="p-0 h-fit shadow-none border border-gray-200 transition-all duration-300 rounded-xl cursor-pointer hover:border-gray-300">
      <CardContent className="py-4 px-6 space-y-4">
        {/* Category & Author */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-900 border border-gray-200">
            {post.category}
          </span>
          <div className="flex items-center gap-3">

            <span className="text-sm font-medium text-gray-900">{post.author._id === userId ? "You" : post.author.username}</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 leading-tight line-clamp-2">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 line-clamp-4 leading-relaxed text-sm">
          {post.content}
        </p>

        {/* Footer */}
        <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
          {/* Stats Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">

              {isCreator && (
                isArchivingOrUnarchivingBlogPost && postBeingUnarchived === post._id ? (
                  <Button
                    disabled={isArchivingOrUnarchivingBlogPost}
                    size="icon-sm"
                    className="hover:bg-transparent bg-transparent"
                  >
                    <CustomSpinner className="text-yellow-600 size-6" />
                  </Button>
                ) : (
                  <PostCardActionButton
                    disabled={isArchivingOrUnarchivingBlogPost}
                    variant="ghost"
                    size="icon-sm"
                    buttonIcon={post.isArchived ? <RotateCcw /> : <Archive />}
                    className="hover:bg-yellow-100 hover:text-yellow-600"
                    tooltipContent={post.isArchived ? "Remove blog post from archived" : "Archive your blog post"}
                    funcToExecuteOnButtonClick={() => {
                      if (post.isArchived) {
                        return onUnarchivePost(postBeingUnarchived)
                      } else {
                        return onPostArchive(postBeingUnarchived)
                      }
                    }}
                  />
                )
              )}


              {!isCreator && (
                isLikingPost && postBeingLiked === post._id ? (
                  <Button disabled={true} variant="ghost" size="icon-sm">
                    <CustomSpinner className="size-6 text-red-600" />
                  </Button>
                ) : (
                  <PostCardActionButton
                    funcToExecuteOnButtonClick={() => onLike(postBeingLiked)}
                    disabled={isCreator || isLikingPost}
                    variant="ghost"
                    size="icon-sm"
                    postId={postBeingLiked}
                    buttonIcon={
                      <Heart
                        size={16} stroke={post.isLikedByCurrentUser ? "oklch(57.7% 0.245 27.325)" : "currentColor"}
                        fill={post.isLikedByCurrentUser ? "oklch(57.7% 0.245 27.325)" : "none"}
                        className="text-gray-600"
                      />
                    }
                    className={`${post.isLikedByCurrentUser ? "text-red-600 hover:bg-red-100 hover:text-red-600" : "text-gray-600 hover:bg-gray-100"}`}
                    tooltipContent={post.isLikedByCurrentUser ? "Unlike this post" : "Like this post"}
                  />
                )
              )}

              <p className="text-gray-500 text-xs">{formatViewCount(post.views)} {post.views === 1 ? "view" : "views"}</p>
            </div>

            {/* View Post Button */}
            {!post.isArchived && (
              <Button
                onClick={() => {
                  if (onPostView) {
                    return onPostView(postBeingViewed || crypto.randomUUID())
                  }
                }}
                variant="ghost"
                size="sm"
                className="h-8 gap-1 px-3 cursor-pointer hover:bg-gray-100 text-gray-700 text-xs group w-fit"
              >
                View Post
                <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            )}
          </div>

          {/* Date */}
          <div>
            <span className="text-xs text-gray-500">Posted on: {formatPostCreationDate(post.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PostCard