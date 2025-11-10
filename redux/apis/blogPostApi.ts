// ** Imports ** \\
import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResult } from "@/types/auth";
import { baseQueryWithReauth } from "../apiSettings";



interface BlogPostsFetchExpectedData {
    page?: string,
    searchQuery?: string,
    _t?: number;
};

// ** Api definition ** \\
const blogPostApi = createApi({
    reducerPath: "blogPostApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getBlogPosts: builder.query<ApiResult, BlogPostsFetchExpectedData>({
            query: (body) => `/posts?page=${body.page}${body.searchQuery ? `&searchQuery=${body.searchQuery}` : ""}${body._t ? `&_t=${body._t}` : ""}`,
        }),

        getCreatedBlogPosts: builder.query<ApiResult, BlogPostsFetchExpectedData>({
            query: (body) => `/posts/created?page=${body.page}${body.searchQuery ? `&searchQuery=${body.searchQuery}` : ""}${body._t ? `&_t=${body._t}` : ""}`,
        }),

        getLikedBlogPosts: builder.query<ApiResult, BlogPostsFetchExpectedData>({
            query: (body) => `/posts/liked?page=${body.page}${body.searchQuery ? `&searchQuery=${body.searchQuery}` : ""}${body._t ? `&_t=${body._t}` : ""}`,
        }),

        getArchivedBlogPosts: builder.query<ApiResult, BlogPostsFetchExpectedData>({
            query: (body) => `/posts/archived?page=${body.page}${body.searchQuery ? `&searchQuery=${body.searchQuery}` : ""}${body._t ? `&_t=${body._t}` : ""}`,
        }),

        createBlogPost: builder.mutation<ApiResult, {
            title: string,
            category: string,
            content: string,
        }>({
            query: (body) => ({
                url: "/posts",
                method: "POST", 
                body,
            })
        }),

        likeOrUnlikeBlogPost: builder.mutation<ApiResult, { postId: string }>({
            query: (body) => ({
                url: `/posts/${body.postId}`,
                method: "PATCH",
            })
        }),

        deleteBlogPost: builder.mutation<ApiResult, { postId: string }>({
            query: (body) => ({
                url: `/posts/${body.postId}`,
                method: "DELETE",
            })
        }),

        getSingleBlogPost: builder.query<ApiResult,{ postId: string }>({
            query: (body) => `/posts/${body.postId}`
        }),

        getBlogPostComments: builder.query<ApiResult, { postId: string, page: string }>({
            query: (body) => `/posts/${body.postId}/comments?page=${body.page}`
        }),

        createNewComment: builder.mutation<ApiResult, { content: string; postId: string; }>({
            query: (body) => ({
                url: `/comments/${body.postId}`,
                method: "POST",
                body: { content: body.content },
            })
        }),

        likeOrUnlikeAComment: builder.mutation<ApiResult, { postId: string; commentId: string}>({
            query: (body) => ({
                url: `/comments/${body.commentId}/${body.postId}`,
                method: "PATCH",
            })
        }),
        newBlogPostView: builder.mutation<ApiResult, { postId: string }>({
            query: (body) => ({
                url: `/posts/${body.postId}/view`,
                method: "POST"
            })
        }),
        archiveOrUnArchiveBlogPost: builder.mutation<ApiResult, { postId: string }>({
            query: (body)=> ({
                url: `/posts/${body.postId}/archive`,
                method: "PATCH"
            })
        })
    }), 
});


export const {
    useLazyGetBlogPostsQuery,
    useLazyGetCreatedBlogPostsQuery,
    useLazyGetLikedBlogPostsQuery,
    useLazyGetArchivedBlogPostsQuery,


    useCreateBlogPostMutation,
    useLikeOrUnlikeBlogPostMutation,
    useDeleteBlogPostMutation,
    useLazyGetSingleBlogPostQuery,
    useLazyGetBlogPostCommentsQuery,
    useCreateNewCommentMutation,
    useLikeOrUnlikeACommentMutation,
    useNewBlogPostViewMutation,
    useArchiveOrUnArchiveBlogPostMutation
   
} = blogPostApi

export default blogPostApi