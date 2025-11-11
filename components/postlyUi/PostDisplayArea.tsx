"use client"
import { BlogPost, setBlogPostLikes } from "@/redux/slices/blogPostsSlice";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import PostCard from "../reusableUi/PostCard";
import { PostCardSkeleton } from "../reusableUi/PostCardSkeleton";
import { callToast } from "@/providers/SonnerProvider";
import React, { useContext, useEffect, useState } from "react";
import { useArchiveOrUnArchiveBlogPostMutation, useLazyGetArchivedBlogPostsQuery, useLazyGetLikedBlogPostsQuery, useLikeOrUnlikeBlogPostMutation } from "@/redux/apis/blogPostApi";
import { useAppDispatch } from "@/redux/store";
import { ApiResult } from "@/types/auth";
import useTrigger from "@/hooks/useTrigger";
import { PaginationContext } from "@/app/postly/layout";
import { useRouter, useSearchParams } from "next/navigation";


interface PostDisplayAreaProps {
    postDisplayType?: "all-posts" | "liked-posts"
    hasError: boolean;
    posts: BlogPost[];
    isFetchingPosts: boolean;
    emptyState: {
        icon: React.ReactElement;
        title: string;
        description?: string;
        emptyContent?: React.ReactElement;
    }
}

const PostDisplayArea = React.memo((props: PostDisplayAreaProps): React.ReactElement => {
    // ** Router and search params ** \\
    const router = useRouter();
    const searchParams = useSearchParams();

    // ** Dispatch init ** \\
    const dispatch = useAppDispatch();

    // ** RTK query to refetch liked blog posts after unliking a blog post ** \\
    const [getLikedPosts] = useLazyGetLikedBlogPostsQuery()

    const { setPostId, postId, setArchivePostId, setActiveView } = useContext(PaginationContext)

    // ** Helper function to update URL with new page ** \\
    const updatePageInURL = (pageType: 'all-posts' | 'created-posts' | 'liked-posts' | 'archived-posts', page: string) => {
        const params = new URLSearchParams(searchParams.toString());

        // Remove all page params first to avoid conflicts
        params.delete('all-posts-page');
        params.delete('created-posts-page');
        params.delete('liked-posts-page');
        params.delete('archived-posts-page');

        // Set the current page param
        if (pageType === 'all-posts') {
            params.set('all-posts-page', page);
        } else if (pageType === 'created-posts') {
            params.set('created-posts-page', page);
        } else if (pageType === 'liked-posts') {
            params.set('liked-posts-page', page);
        } else if (pageType === 'archived-posts') {
            params.set('archived-posts-page', page);
        }

        // Update URL without page reload
        router.push(`?${params.toString()}`, { scroll: false });
    };

    // ** Liking or unliking a post ** \\
    const [postBeingLiked, setPostBeingLiked] = useState<string>("");
    const [
        likeOrUnlikeBlogPost,
        {
            isLoading: isLikingOrUnlikingBlogPost,
            isError: errorOccuredInLikingOrUnlikingBlogPost,
            error: errorObjectInLikingOrUnlinkingBlogPost,
            isSuccess: successInLikingOrUnlikingBlogPost,
            data: dataInLikingOrUnlikingBlogPost
        },
    ] = useLikeOrUnlikeBlogPostMutation();

    // ** Function that handles like/unliking ** \\
    const likeOrUnlikePost = async (
        postId: string
    ) => {
        try {
            setPostBeingLiked(postId);
            return await likeOrUnlikeBlogPost({ postId })
        } catch (err) {
            console.error(`Error occured in function "likedOrUnlikePost" in file "PostsPage.tsx": ${err}`);
            return callToast("error", "An unexpected error occured while trying to fufill your request to like/unlike the post, please try again shortly");
        }
    };

    useEffect(() => {
        let isMounted = true;
        const successfullCases = successInLikingOrUnlikingBlogPost && !errorOccuredInLikingOrUnlikingBlogPost && !errorObjectInLikingOrUnlinkingBlogPost;
        const failureCases = !successInLikingOrUnlikingBlogPost &&
            errorOccuredInLikingOrUnlikingBlogPost &&
            errorObjectInLikingOrUnlinkingBlogPost && "data" in errorObjectInLikingOrUnlinkingBlogPost;

        if (successfullCases) {
            if (isMounted) {
                const typedData = dataInLikingOrUnlikingBlogPost.data as { likes: number }
                dispatch(setBlogPostLikes({ postId: postBeingLiked, likes: typedData.likes }));


                if (props.postDisplayType === "liked-posts") {
                    if (isMounted) {
                        // ** Reset to page 1 in URL when unliking from liked posts ** \\
                        updatePageInURL('liked-posts', '1');
                        getLikedPosts({ page: "1" });
                    }
                }
            }
        }

        if (failureCases) {
            if (isMounted) {
                callToast("error", (errorObjectInLikingOrUnlinkingBlogPost.data as ApiResult).message)
            }
        }
        return () => { isMounted = false }
    }, [
        errorObjectInLikingOrUnlinkingBlogPost,
        errorOccuredInLikingOrUnlikingBlogPost,
        successInLikingOrUnlikingBlogPost,
        dataInLikingOrUnlikingBlogPost,
    ]);
    const { mutateTrigger } = useTrigger();


    // ** Post Viewing ** \\
    const onPostView = (postId: string) => {
        setPostId(postId);
        return mutateTrigger("postViewModal", true);
    };

    // ** Post archive ** \\
    const onPostArchive = (id: string) => {
        setArchivePostId(id);
        return mutateTrigger("archivePostConfirmationModal", true)
    };

    const [getArchivedBlogPosts] = useLazyGetArchivedBlogPostsQuery();


    const [archiveBlogPost, {
        isLoading,
        isError,
        error,
        isSuccess,
        data
    }] = useArchiveOrUnArchiveBlogPostMutation();


    const [postBeingUnarchived, setPostBeingUnarchived] = useState<string>("");
    // ** Post unarchive ** \\
    const onPostUnarchive = async (id: string) => {
        try {
            setPostBeingUnarchived(id);
            return await archiveBlogPost({ postId: id });
        } catch (err) {
            console.error(`Error occured in function "onPostUnarchive" in file "PostDisplayArea.tsx": ${err}`);
            return callToast("error", "An unexpected error occured while trying to remove the requested post from your archived list, please try again shortly")
        }
    }

    // ** UseEffect to handle unarchiving blog posts ** \\

    React.useEffect(() => {
        if (isSuccess) {
            // ** Reset to page 1 in URL when unarchiving from archived posts ** \\
            callToast("success", data.message);
            updatePageInURL('archived-posts', '1');
            setActiveView("archived-posts");
            getArchivedBlogPosts({ page: "1", _t: Date.now() });
        }

        if (isError && error && "data" in error) {
            const typedError = error.data as ApiResult;
            callToast("error", typedError.message);
        }
    }, [isSuccess, isError, error, data, callToast]);

    return (
        props.isFetchingPosts ? (
            <div
                className={`${props.posts.length !== 1 && "grid  md:grid-cols-2"} gap-6`}
            >
                {Array.from({ length: 16 }).map((_, index) => (
                    <PostCardSkeleton key={index} />
                ))}
            </div>
        ) : (
            <section className={` ${props.hasError || props.posts.length <= 0 ? "h-[60vh] flex justify-center items-center" :
                props.posts.length !== 1 ? "grid md:grid-cols-2 gap-6" : ""
                } mb-12`}>
                {props.hasError ? (
                    <div
                        className="bg-red-100 w-full max-w-xs h-24 rounded-sm border border-red-600
              text-red-600 flex justify-center items-center text-sm"
                    >
                        Failed to fetch blog posts
                    </div>
                ) : props.posts.length <= 0 ? (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                {props.emptyState.icon}
                            </EmptyMedia>
                            <EmptyTitle>{props.emptyState.title}</EmptyTitle>
                            {props.emptyState.description && (
                                <EmptyDescription>{props.emptyState.description}</EmptyDescription>
                            )}
                        </EmptyHeader>

                        {props.emptyState.emptyContent && (
                            <EmptyContent>
                                {props.emptyState.emptyContent}
                            </EmptyContent>
                        )}
                    </Empty>
                ) : props.posts.map((post: BlogPost): React.ReactElement => {
                    return (
                        <PostCard
                            key={post._id}
                            post={post}
                            postBeingUnarchived={postBeingUnarchived}
                            isArchivingOrUnarchivingBlogPost={isLoading}
                            onUnarchivePost={() => onPostUnarchive(post._id)}
                            onLike={() => likeOrUnlikePost(post._id)}
                            isLikingPost={isLikingOrUnlikingBlogPost}
                            postBeingLiked={postBeingLiked}
                            onPostArchive={() => onPostArchive(post._id)}
                            onPostView={() => onPostView(post._id)}
                            postBeingViewed={postId}
                        />
                    )
                })}
            </section>
        )
    );
});

export default PostDisplayArea;