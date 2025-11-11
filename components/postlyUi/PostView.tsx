"use client"
import { CirclePlus, Heart, X } from "lucide-react"
import React, { useContext, useRef, useState } from "react"
import { Button } from "../ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { BlogPost, setBlogPostLikes, newPostView, PaginationData } from "@/redux/slices/blogPostsSlice";
import { Comment, getInitialComments, getMoreComments, likeOrUnlikeNewComment } from "@/redux/slices/commentsSlice";
import { useCreateNewCommentMutation, useLazyGetBlogPostCommentsQuery, useLazyGetLikedBlogPostsQuery, useLazyGetSingleBlogPostQuery, useLikeOrUnlikeACommentMutation, useLikeOrUnlikeBlogPostMutation, useNewBlogPostViewMutation } from "@/redux/apis/blogPostApi";
import CustomSpinner from "../reusableUi/CustomSpinner";
import { PaginationContext } from "@/app/postly/layout";
import { updatePostView } from "@/redux/slices/userSlice";
import { ApiResult } from "@/types/auth";
import { callToast } from "@/providers/SonnerProvider";
import CommentItemSkeleton from "./CommentItemSkeleton";
import { CommentItem, formatTimeAgo } from "./CommentItem";
import { useRouter, useSearchParams } from "next/navigation";
import useResizer from "@/hooks/useResizer";
import { formatViewCount } from "../reusableUi/PostCard";

const PostView = React.memo(({ postId, onClose }: {
    postId: string,
    onClose?: () => void
}): React.ReactElement => {

    // ** Router and search params initialization ** \\
    const router = useRouter();
    const searchParams = useSearchParams();


    // ** Global state that houses comments ** \\
    const comments = useAppSelector((state) => state.comments.comments);

    // ** Users profile ** \\
    const profile = useAppSelector((state) => state.user.profile);


    // ** Local state that houses information about the clicked post ** \\
    const [postBeingViewed, setPostBeingViewed] = useState<BlogPost | null>(null);
    const dispatch = useAppDispatch();
    const { activeView, totalComments, setTotalComments } = useContext(PaginationContext)

    // ** Rtk query (to handle fetching a single post details) ** \\
    const [getSingleBlogPost, {
        isFetching: isFetchingSingleBlogPost,
        isLoading: isLoadingSingleBlogPost,
        isError: isErrorSingleBlogPost,
        error: errorSingleBlogPost,
        isSuccess: isSuccessSingleBlogPost,
        data: singleBlogPostData
    }] = useLazyGetSingleBlogPostQuery();

    // ** Rtk query (to handle comments fetching) ** \\
    const [getBlogPostComments, {
        isLoading: isLoadingBlogPostComments,
        isFetching: isFetchingBlogPostComments,
        isError: isErrorBlogPostComments,
        error: errorBlogPostComments,
        isSuccess: isSuccessBlogPostComments,
        data: blogPostCommentsData
    }] = useLazyGetBlogPostCommentsQuery();


    // ** Rtk query (to register post view) ** \\
    const [registerBlogPostView, {
        isLoading: isRegisteringPostView,
        isError: isErrorInRegisteringPostView,
        error: errorInRegisteringPostView,
        isSuccess: successfullyRegisteredPostView,
    }] = useNewBlogPostViewMutation();


    // ** Custom state to handle specific errors ** \\
    const [
        errorDuringRegisteringPostview,
        setErrorDuringRegisteringPostview
    ] = useState<boolean>(false);

    const functionToRegisterBlogPostView = async () => {
        try {
            return await registerBlogPostView({ postId })
        } catch (err) {
            setErrorDuringRegisteringPostview(true);
            console.error(`Error in function "functionToRegisterBlogPostView" in file "PostView.tsx": ${err}`);
            return callToast("error", "An unexpected error occured while trying to register your post view, please try again shortly")
        }
    }

    // ** Call function to register blog post view ** \\
    const postViewRef = useRef<boolean>(false);
    React.useEffect(() => {
        if (postViewRef.current) return;
        functionToRegisterBlogPostView();
        postViewRef.current = false;
    }, []);

    // ** UseEffect to handle errors in registering blog post view ** \\
    React.useEffect(() => {
        let isMounted = true;
        const successfullCases = successfullyRegisteredPostView && !isErrorInRegisteringPostView && !errorInRegisteringPostView;
        const failureCases = !successfullyRegisteredPostView && isErrorInRegisteringPostView && errorInRegisteringPostView && "data" in errorInRegisteringPostView;

        if (successfullCases) {

            if (activeView === "all-posts") {
                if (isMounted) dispatch(newPostView({ postId, currentUsersId: profile._id }));
            }

            if (activeView === "liked-posts") {
                if (isMounted) dispatch(updatePostView({ postId, postType: "likedBlogPosts", currentUserId: profile._id }));
            };

            // ** Get blog post AFTER successfully registering post view ** \\
            if (isMounted) getSingleBlogPost({ postId });
        }

        if (failureCases) {
            const errorStatusCode = errorInRegisteringPostView.status;

            if (errorStatusCode !== 406) {
                if (isMounted) {
                    // ** Set specific error ** \\
                    setErrorDuringRegisteringPostview(true);
                }
            }

            if (errorStatusCode === 406) {
                if (isMounted && !isRegisteringPostView) getSingleBlogPost({ postId });
            }
        }

        return () => { isMounted = false }
    }, [
        successfullyRegisteredPostView,
        isErrorInRegisteringPostView,
        errorInRegisteringPostView,
        dispatch
    ]);

    // ** Decisive state that handles loading across post view registratio and post fetching  ** \\
    const isPostFetchOperationHappening = isRegisteringPostView || isLoadingSingleBlogPost || isFetchingSingleBlogPost;
    const postFetchOperationError = errorDuringRegisteringPostview || (isErrorSingleBlogPost && errorSingleBlogPost);

    // **  State to handle comments page ** \\
    const [commentsPage, setCommentsPage] = useState<string>("1");


    // ** UseEffect to handle both successfully and error cases in single post fetch ** \\
    React.useEffect(() => {
        let isMounted = true;

        if (isSuccessSingleBlogPost && !isErrorSingleBlogPost && !errorSingleBlogPost) {
            const typedExpectedData = (singleBlogPostData.data as { post: BlogPost });

            if (isMounted) {
                setPostBeingViewed(typedExpectedData.post);

                console.log("DATA FROM API: ", typedExpectedData)
                // ** Fetch comments immediately after successful blog post fetch ** \\
                getBlogPostComments({ postId, page: commentsPage });
            }
        }

        if (!isSuccessSingleBlogPost && isErrorSingleBlogPost && errorSingleBlogPost && "data" in errorSingleBlogPost) {
            const typedExpectedError = errorSingleBlogPost.data as ApiResult;


            if (isMounted) {
                callToast("error", typedExpectedError.message);
            }
        }

        return () => { isMounted = false };
    }, [
        isSuccessSingleBlogPost,
        isErrorSingleBlogPost,
        errorSingleBlogPost,
        singleBlogPostData,
        callToast
    ]);

    // ** Function to fetch more comments ** \\
    const getMorePaginatedComments = () => {
        return setCommentsPage((prevState) => {
            return (Number(prevState) + 1).toString()
        });
    }

    // ** UseEffect to refetch comments after detecting page change ** \\
    React.useEffect(() => {
        let isMounted = true;
        if (isMounted) getBlogPostComments({ postId, page: commentsPage });
        return () => { isMounted = false }
    }, [commentsPage]);

    // ** UseEffect to handle successfull/failure cases in comment fetching ** \\
    React.useEffect(() => {
        let isMounted = true;
        const successfullCases = !isErrorBlogPostComments && !errorBlogPostComments && isSuccessBlogPostComments;
        const failureCases = isErrorBlogPostComments && errorBlogPostComments && !isSuccessBlogPostComments && "data" in errorBlogPostComments;

        if (successfullCases) {
            const expectedData = (blogPostCommentsData.data) as { paginationData: PaginationData<Omit<Comment, "blogPost">[]>, totalComments: number }

            if (isMounted) {
                setTotalComments(expectedData.totalComments)
                if (commentsPage === "1") {
                    dispatch(getInitialComments(
                        expectedData.paginationData.data.map((data) => { return { ...data, blogPost: postId } })
                    ));
                } else {
                    dispatch(getMoreComments(
                        expectedData.paginationData.data.map((data) => { return { ...data, blogPost: postId } })
                    ));
                }
            }
        }

        if (failureCases) {
            if (isMounted) callToast("error", (errorBlogPostComments.data as ApiResult).message || "Failed to fetch comments");
        }

        return () => { isMounted = false }
    }, [
        isErrorBlogPostComments,
        errorBlogPostComments,
        isSuccessBlogPostComments,
        blogPostCommentsData,
        dispatch,
        callToast,
        commentsPage,
    ]);

    const failedToFetchComments = isErrorBlogPostComments && errorBlogPostComments && !isSuccessBlogPostComments;

    // ** Rtk query (like/unlike this blog post) ** \\
    const [likeOrUnlikePost, {
        isLoading: isLikingOrUnliking,
        error: errorInLikingOrUnliking,
        isError: isErrorInLikingOrUnliking,
        isSuccess: isSuccessInLikingOrUnliking,
        data: recievedDataAfterLikingOrUnliking
    }] = useLikeOrUnlikeBlogPostMutation();

    // ** Rtk query (to refetch liked blog posts) ** \\
    const [fetchLikedBlogPosts] = useLazyGetLikedBlogPostsQuery();

    // ** UseEffect to handle successfull and error cases in liking or unliking this post ** \\
    React.useEffect(() => {
        let isMounted = true;
        const successfullCases = isSuccessInLikingOrUnliking && !isErrorInLikingOrUnliking && !errorInLikingOrUnliking;
        const failureCases = !isSuccessInLikingOrUnliking && isErrorInLikingOrUnliking && errorInLikingOrUnliking && "data" in errorInLikingOrUnliking;

        if (successfullCases) {
            const expectedData = recievedDataAfterLikingOrUnliking.data as { likes: number };

            if (postBeingViewed) {
                if (isMounted) {
                    const mutatedPost = {
                        ...postBeingViewed,
                        isLikedByCurrentUser: !postBeingViewed.isLikedByCurrentUser,
                        likes: expectedData.likes
                    }
                    setPostBeingViewed(mutatedPost);
                    dispatch(setBlogPostLikes({ postId, likes: expectedData.likes }));

                    // ** IF active view is liked posts then refetch the posts after unliking ** \\
                    if (activeView === "liked-posts") {
                        const params = new URLSearchParams(searchParams.toString());
                        params.delete('all-posts-page');
                        params.delete('created-posts-page');
                        params.delete('liked-posts-page');
                        params.set('liked-posts-page', '1');
                        router.push(`?${params.toString()}`, { scroll: false });

                        // ** Refetch liked blog posts ** \\\
                        fetchLikedBlogPosts({ page: "1" });
                    }
                }
            }
        }


        if (failureCases) {
            if (isMounted) {
                callToast("error", (errorInLikingOrUnliking.data as ApiResult).message);
            }
        }
        return () => { isMounted = false }
    }, [
        errorInLikingOrUnliking,
        isErrorInLikingOrUnliking,
        isSuccessInLikingOrUnliking,
        recievedDataAfterLikingOrUnliking,
        callToast,
        dispatch
    ]);

    const likeOrUnlikeCurrentPost = async () => {
        try {
            return likeOrUnlikePost({ postId });
        } catch (err) {
            console.error(`Error occured in "likeOrUnlikeCurrentPost" async function in file "PostView.tsx": ${err}`);
            return callToast("error", "An unexpected error occured while trying to fufill your request to like/unlike this post, please try again shortly")
        }
    };


    // ** Adding a new comment ** \\
    const [commentContent, setCommentContent] = useState<string>("");
    const [createComment, {
        isLoading: isAddingNewComment,
        error: errorInAddingNewComment,
        isError: isErrorInAddingNewComment,
        isSuccess: isSuccessInAddingNewComment,
        data: dataInAddingNewComment
    }] = useCreateNewCommentMutation()

    // ** Function to actually trigger adding a new comment ** \\
    const addNewComment = async () => {
        try {
            if (!commentContent || commentContent.trim() === "" || commentContent.length <= 1) {
                callToast("error", "Comment must be provided")
                return;
            }

            if (commentContent.length > 300) {
                callToast("error", "Comment cannot exceed 300 characters")
                return;
            };

            return await createComment({ postId, content: commentContent })
        } catch (err) {
            console.error(`Error in "addNewComment" function in file PostView.tsx: ${err}`);
            return callToast("error", "An unexpected error occured while trying to create your new comment we know this is not ideal,  please try again shortly")
        }
    };

    const handleScrollToTheTop = () => {
        if (commentsDivRef.current) {
            commentsDivRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // ** Ref to handle scroll to the top after posting comment ** \\
    const commentsDivRef = useRef<HTMLDivElement | null>(null);

    // ** Track if we should scroll after comments update ** \\
    const [shouldScrollAfterUpdate, setShouldScrollAfterUpdate] = useState(false);

    // ** UseEffect to handle cases in adding new comment ** \\
    React.useEffect(() => {
        let isMounted = true;

        if (isSuccessInAddingNewComment && !errorInAddingNewComment && !isErrorInAddingNewComment) {
            if (postBeingViewed) {
                const updatedPostBeingViewed = {
                    ...postBeingViewed,
                    comments: postBeingViewed.comments + 1
                };
                if (isMounted) setPostBeingViewed(updatedPostBeingViewed)
            };

            if (isMounted) {
                setCommentContent("");
                setShouldScrollAfterUpdate(true);
                setCommentsPage("1");
                getBlogPostComments({ postId, page: "1" });
            }
        }

        if (
            !isSuccessInAddingNewComment &&
            errorInAddingNewComment &&
            isErrorInAddingNewComment &&
            "data" in errorInAddingNewComment
        ) {
            if (isMounted)
                callToast("error", (errorInAddingNewComment.data as ApiResult).message)
        };

        return () => { isMounted = false }
    }, [
        isSuccessInAddingNewComment,
        errorInAddingNewComment,
        isErrorInAddingNewComment,
        dataInAddingNewComment,
        callToast
    ]);

    // ** UseEffect to handle scrolling ONLY after new comment creation ** \\
    React.useEffect(() => {
        let isMounted = true;

        if (isMounted && shouldScrollAfterUpdate && comments.length > 0) {
            handleScrollToTheTop();
            setShouldScrollAfterUpdate(false);
        }

        return () => { isMounted = false };
    }, [comments, shouldScrollAfterUpdate]);


    // ** Rtk query (to handle liking or unliking a comment) ** \\
    const [likeOrUnlikeComment, {
        isLoading: isLikingOrUnlikingComment,
        error: errorInLikingOrUnlikingComment,
        isError: isErrorInLikingOrUnlikingComment,
        isSuccess: successfullyLikedOrUnlikedComment
    }] = useLikeOrUnlikeACommentMutation();

    // ** Function to actually trigger liking or unliking of a comment ** \\
    const [commentBeingLikedOrUnliked, setCommentBeingLikedOrUnliked] = useState<string>("");
    const likeOrUnlikeUserComment = async (commentId: string) => {
        try {
            setCommentBeingLikedOrUnliked(commentId);
            return await likeOrUnlikeComment({ postId, commentId: commentId });
        } catch (err) {
            console.error(`Error occured in "likeOrUnlikeUserComment" in file "PostView.tsx": ${err}`);
            return callToast("error", "An unexpecte error occured while trying to fufill your request to like/unlike the requested comment, please try again shortly");
        }
    };

    // ** UseEffect to handle both successfull and failure cases when liking/unliking a comment ** \\
    React.useEffect(() => {
        let isMounted = true;
        const successfullCases = successfullyLikedOrUnlikedComment && !errorInLikingOrUnlikingComment && !isErrorInLikingOrUnlikingComment;
        const failureCases = !successfullyLikedOrUnlikedComment && errorInLikingOrUnlikingComment && isErrorInLikingOrUnlikingComment && "data" in errorInLikingOrUnlikingComment;

        if (successfullCases) {
            if (isMounted) {
                dispatch(likeOrUnlikeNewComment({ commentId: commentBeingLikedOrUnliked }));
            }
        }

        if (failureCases) {
            if (isMounted) callToast("error", (errorInLikingOrUnlikingComment.data as ApiResult).message);
        }
        return () => { isMounted = false }
    }, [
        successfullyLikedOrUnlikedComment,
        errorInLikingOrUnlikingComment,
        isErrorInLikingOrUnlikingComment,
        dispatch
    ]);

    const { isDesiredScreen } = useResizer(1024);

    const refethchAllPosts = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('all-posts-page');
        params.delete('created-posts-page');
        params.delete('liked-posts-page');
        params.set('all-posts-page', '1');
        router.push(`?${params.toString()}`, { scroll: false });

        if (onClose) return onClose();
    }


    return (
        isPostFetchOperationHappening || !postBeingViewed ? (
            <div
                className="w-full h-full flex justify-center items-center lg:rounded-sm"
            >
                <CustomSpinner className="size-6" />
            </div>
        ) : postBeingViewed?.isArchived ? (
            <div
                className="w-full h-full flex flex-col lg:rounded-sm"
            >
                <header
                    className="flex items-center justify-end p-6"
                >
                    {isDesiredScreen && (
                        <Button
                            // onClick={() => mutateTrigger("postViewModal", false)}
                            variant="outline"
                            size="sm"
                            className="cursor-pointer"
                            onClick={refethchAllPosts}
                            aria-label="Close"
                        >
                            Close
                        </Button>
                    )}
                </header>
                <main className="flex-1 flex justify-center items-center">
                    <div
                        className="flex justify-center items-center bg-yellow-100 rounded-xl h-20 w-full max-w-md
                    text-yellow-600 text-sm border border-yellow-600"
                    >
                        This post has been archived by It&#39;s creator
                    </div>
                </main>
            </div>
        ) : postFetchOperationError ? (
            <div
                className="flex justify-center items-center h-full w-full lg:rounded-sm"
            >
                <div
                    className="bg-red-100 text-red-600 border border-destructive
                  flex justify-center items-center w-full max-w-md h-20 rounded-sm"
                >
                    Failed to fetch blog post data
                </div>
            </div>
        ) : (
            <div ref={commentsDivRef} onClick={postBeingViewed.isArchived ? refethchAllPosts : () => { }} className="h-full flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden lg:rounded-sm">
                {/* Main Content - Scrolls independently only on desktop (lg and above) */}
                <main className="flex-1 lg:overflow-y-auto bg-white">
                    <header className="sticky top-0 border-b border-gray-200 px-4 sm:px-6 py-4 bg-white z-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-sm">
                                    {profile.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h1 className="text-lg font-semibold text-gray-900">{postBeingViewed.author.username}</h1>
                                    <p className="text-sm text-gray-500">Posted: {formatTimeAgo(postBeingViewed.createdAt || new Date().toISOString())}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {!postBeingViewed || (postBeingViewed.author._id !== profile._id) && (
                                    isLikingOrUnliking ? (
                                        <Button variant="ghost" size="icon" disabled={true}>
                                            <CustomSpinner className="text-red-600" />
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={likeOrUnlikeCurrentPost}
                                            disabled={isLikingOrUnliking} variant="ghost" size="icon" className={`
                                        ${postBeingViewed?.isLikedByCurrentUser ? "hover:bg-red-100" : "hover:bg-gray-100"} cursor-pointer`}>
                                            <Heart
                                                fill={postBeingViewed?.isLikedByCurrentUser ? "oklch(57.7% 0.245 27.325)" : "#6a7282"}
                                                stroke="none"
                                                className="size-5 cursor-pointer"
                                            />
                                        </Button>
                                    )
                                )}

                                {isDesiredScreen && (
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        className="cursor-pointer"
                                        onClick={onClose}
                                        aria-label="Close"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </header>

                    <article className="lg:max-w-3xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4 flex-wrap">
                                <span className="px-3 py-1 bg-gray-100 border border-gray-200 text-sm font-medium rounded-full
                            text-center sm:text-start">
                                    {postBeingViewed?.category || "Post category"}
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{postBeingViewed?.title || "Post title"}</h1>
                            <div className="flex items-center gap-6 text-sm text-gray-600 flex-wrap">
                                <div className="flex items-center gap-1">
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    <span>
                                        {formatViewCount(postBeingViewed?.likes || 0)} {postBeingViewed?.likes === 1 ? "like" : "likes"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <span>
                                        {formatViewCount(postBeingViewed?.comments || 0)} {postBeingViewed?.comments === 1 ? "comment" : "comments"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <span>
                                        {formatViewCount(postBeingViewed?.views || 0)} {postBeingViewed?.views === 1 ? "view" : "views"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="prose max-w-none">
                            <div className="text-gray-700 leading-7 text-base sm:text-lg whitespace-pre-line wrap-break-word">
                                {postBeingViewed?.content || "Post content"}
                            </div>
                        </div>
                    </article>
                </main>

                {/* Comments Sidebar - Scrolls independently only on desktop */}
                <aside className="w-full mb-60  lg:mb-0 lg:w-96 xl:w-[470px] border-t lg:border-t-0 lg:border-l border-gray-200 bg-white flex flex-col lg:h-full">
                    <div className="border-b border-gray-200 px-4 sm:px-5 py-4 sm:py-[26px]">
                        <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
                    </div>

                    {isLoadingBlogPostComments ? (
                        <div className="flex-1 lg:overflow-y-auto p-4 space-y-6 ">
                            {Array.from({ length: 6 }, (_, i: number) => (<CommentItemSkeleton key={i} />))}
                        </div>

                    ) : failedToFetchComments ? (
                        <div
                            className="flex-1 flex justify-center items-center"
                        >
                            <Empty>
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <X />
                                    </EmptyMedia>
                                    <EmptyTitle>Failed to fetch comments</EmptyTitle>
                                </EmptyHeader>
                            </Empty>
                        </div>
                    ) : comments.length <= 0 ? (
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </EmptyMedia>
                                <EmptyTitle>No comments yet</EmptyTitle>
                                <EmptyDescription>Be the first to share your thoughts on this post</EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    ) : (
                        <div ref={commentsDivRef} className="flex-1 lg:overflow-y-auto p-4 space-y-6 min-h-0">
                            {comments.map((comment) => (
                                <CommentItem
                                    onCommentLike={() => likeOrUnlikeUserComment(comment._id)}
                                    commentBeingLikedOrUnliked={commentBeingLikedOrUnliked}
                                    isLikingOrUnlikingComment={isLikingOrUnlikingComment}
                                    key={comment._id}
                                    comment={comment}
                                />
                            ))}

                            {comments.length < 20 || comments.length >= totalComments ? null : (
                                <div
                                    className="w-full flex justify-center items-center"
                                >
                                    <Button
                                        disabled={isFetchingBlogPostComments}
                                        onClick={getMorePaginatedComments}
                                        variant="ghost"
                                        className="cursor-pointer"
                                        size="icon-sm"
                                    >
                                        {isFetchingBlogPostComments ? <CustomSpinner /> : <CirclePlus />}
                                    </Button>
                                </div>
                            )}
                        </div>

                    )}

                    <div className="border-t border-gray-200 fixed bottom-0 w-full lg:relative p-4 bg-white">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 shrink-0
                        flex justify-center items-center">
                                J
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-col">
                                    <textarea
                                        value={commentContent}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                            const value = e.target.value;
                                            if (value.length > 300) return;

                                            return setCommentContent(e.target.value)
                                        }}
                                        disabled={failedToFetchComments || isAddingNewComment}
                                        placeholder="Add a comment..."
                                        className={`w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none
                                transition-all duration-200 disabled:transition-none disabled:duration-none disabled:opacity-50 focus:ring-2 focus:ring-gray-400 border-gray-300 
                                disabled:cursor-not-allowed 
                                `}
                                        rows={2}
                                    />

                                </div>
                                <div className="flex justify-end mt-2">
                                    <Button
                                        onClick={addNewComment || isFetchingBlogPostComments}
                                        disabled={failedToFetchComments || isFetchingBlogPostComments || (commentContent.length <= 1 || commentContent.trim() === "" || commentContent.length > 300) || isAddingNewComment}
                                        className="rounded-lg cursor-pointer"
                                    >
                                        {isAddingNewComment ? <>Commenting... <CustomSpinner /></> : "Comment"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        )
    );
});

export default PostView

