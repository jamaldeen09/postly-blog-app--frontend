"use client"
import React, { useContext, useEffect, useRef } from "react";
import { Archive, CirclePlus, Heart, Home } from "lucide-react";
import PostlyNavbar from "./PostlyNavbar";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useLazyGetArchivedBlogPostsQuery, useLazyGetBlogPostsQuery, useLazyGetCreatedBlogPostsQuery, useLazyGetLikedBlogPostsQuery } from "@/redux/apis/blogPostApi";
import PostDisplayArea from "./PostDisplayArea";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { debounce } from "lodash";
import { BlogPost, getBlogPosts, PaginationData } from "@/redux/slices/blogPostsSlice";
import { ApiResult } from "@/types/auth";
import { callToast } from "@/providers/SonnerProvider";
import { PaginationContext } from "@/app/postly/layout";
import { fetchBlogPosts } from "@/redux/slices/userSlice";
import PaginationSkeleton from "../reusableUi/PaginationSkeleton";
import smoothscroll from 'smoothscroll-polyfill';
import { useSearchParams, useRouter } from "next/navigation";

const PostsPage = (): React.ReactElement => {
    // ** Router and search params ** \\
    const router = useRouter();
    const searchParams = useSearchParams();

    // ** Dispatch initialization ** \\
    const dispatch = useAppDispatch();

    // ** Context values ** \\
    const {
        totalPages,
        setTotalPages,
        activeView,
        setActiveView,
        searchQuery,
        setSearchQuery,
    } = useContext(PaginationContext);

    // ** Ref for handling immediate scrolling to the top on any page change ** \\
    const mainDivRef = useRef<HTMLDivElement | null>(null);
    smoothscroll.polyfill();

    const scrollToMainDivTop = () => {
        if (mainDivRef.current) {
            const headerElement = mainDivRef.current.querySelector('header');
            if (headerElement) {
                headerElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    };

    // ** Helper function to validate and get page from URL ** \\
    const getValidatedPage = (pageParam: string | null): string => {
        if (!pageParam) return '1';

        const pageNum = Number(pageParam);
        // ** Check if it's a valid number, positive integer, and not NaN ** \\\
        if (isNaN(pageNum) || pageNum < 1 || !Number.isInteger(pageNum)) {
            return '1';
        }

        return pageParam;
    };

    // ** Helper functions to get validated page from URL ** \\
    const getAllPostsPage = () => getValidatedPage(searchParams.get('all-posts-page'));
    const getCreatedPostsPage = () => getValidatedPage(searchParams.get('created-posts-page'));
    const getLikedPostsPage = () => getValidatedPage(searchParams.get('liked-posts-page'));
    const getArchivedPostsPage = () => getValidatedPage(searchParams.get("archived-posts-page"))

    // ** Helper function to detect which view should be active based on URL ** \\
    const detectActiveViewFromURL = (): "all-posts" | "my-posts" | "liked-posts" | "archived-posts" => {
        const allPostsPage = searchParams.get('all-posts-page');
        const createdPostsPage = searchParams.get('created-posts-page');
        const likedPostsPage = searchParams.get('liked-posts-page');
        const archivedPostsPage = searchParams.get("archived-posts-page")

        // ** If any page parameter exists, use that view ** \\
        if (createdPostsPage) return "my-posts";
        if (likedPostsPage) return "liked-posts";
        if (allPostsPage) return "all-posts";
        if (archivedPostsPage) return "archived-posts"


        // ** Default to all-posts if no page parameters ** \\
        return "all-posts";
    };

    // ** Helper function to update URL with new page ** \\
    const updatePageInURL = (pageType: 'all-posts' | 'created-posts' | 'liked-posts' | "archived-posts", page: string) => {
        const params = new URLSearchParams(searchParams.toString());

        // ** Remove all page params first to avoid conflicts ** \\
        params.delete('all-posts-page');
        params.delete('created-posts-page');
        params.delete('liked-posts-page');
        params.delete("archived-posts-page")

        // Set the current page param
        if (pageType === 'all-posts') {
            params.set('all-posts-page', page);
        } else if (pageType === 'created-posts') {
            params.set('created-posts-page', page);
        } else if (pageType === 'liked-posts') {
            params.set('liked-posts-page', page);
        } else if (pageType === 'archived-posts') {
            params.set('archived-posts-page', page)
        }

        // Update URL without page reload
        router.push(`?${params.toString()}`, { scroll: false });
    };

    // ** UseEffect to set active view based on URL parameters on initial load ** \\
    useEffect(() => {
        const detectedView = detectActiveViewFromURL();
        if (detectedView !== activeView) {
            setActiveView(detectedView);
        }
    }, []);

    // ** UseEffect to validate page parameters on URL changes ** \\
    useEffect(() => {
        const allPostsPage = searchParams.get('all-posts-page');
        const createdPostsPage = searchParams.get('created-posts-page');
        const likedPostsPage = searchParams.get('liked-posts-page');
        const archivedPostsPage = searchParams.get('archived-posts-page');

        let shouldUpdateURL = false;
        const params = new URLSearchParams(searchParams.toString());


        if (allPostsPage && getValidatedPage(allPostsPage) !== allPostsPage) {
            params.set('all-posts-page', '1');
            shouldUpdateURL = true;
        }


        if (createdPostsPage && getValidatedPage(createdPostsPage) !== createdPostsPage) {
            params.set('created-posts-page', '1');
            shouldUpdateURL = true;
        }

        if (likedPostsPage && getValidatedPage(likedPostsPage) !== likedPostsPage) {
            params.set('liked-posts-page', '1');
            shouldUpdateURL = true;
        }


        if (archivedPostsPage && getValidatedPage(archivedPostsPage) !== archivedPostsPage) {
            params.set('archived-posts-page', '1');
            shouldUpdateURL = true
        }


        if (shouldUpdateURL) {
            router.push(`?${params.toString()}`, { scroll: false });
        }
    }, [searchParams, router]);

    // ** Rtk query (All posts) ** \\
    const [
        getAllBlogPosts,
        {
            isError: allBlogPostsIsError,
            isSuccess: allBlogPostsIsSuccess,
            error: allBlogPostsError,
            data: allBlogPostsData,
            isLoading: isLoadingAllBlogPosts,
            isFetching: isFetchingAllBlogPosts
        }
    ] = useLazyGetBlogPostsQuery();

    // ** Rtk query (liked posts)** \\
    const [
        getLikedBlogPosts,
        {
            isError: likedBlogPostsIsError,
            isSuccess: likedBlogPostsIsSuccess,
            error: likedBlogPostsError,
            data: likedBlogPostsData,
            isLoading: isLoadingLikedBlogPosts,
            isFetching: isFetchingLikedBlogPosts
        }
    ] = useLazyGetLikedBlogPostsQuery();

    // ** Rtk query (created posts)** \\
    const [
        getCreatedBlogPosts,
        {
            isError: createdBlogPostsIsError,
            isSuccess: createdBlogPostsIsSuccess,
            error: createdBlogPostsError,
            data: createdBlogPostsData,
            isLoading: isLoadingCreatedBlogPosts,
            isFetching: isFetchingCreatedBlogPosts
        }
    ] = useLazyGetCreatedBlogPostsQuery();

    const [
        getArchivedBlogPosts,
        {
            isError: archivedBlogPostsIsError,
            isSuccess: archivedBlogPostsIsSuccess,
            error: archivedBlogPostsError,
            data: archivedBlogPostsData,
            isLoading: isLoadingArchivedBlogPosts,
            isFetching: isFetchingArchivedBlogPosts,
        }
    ] = useLazyGetArchivedBlogPostsQuery();



    // ** Boolean to track all fetching states across all queries ** \\
    const isLoading = isLoadingLikedBlogPosts || isLoadingCreatedBlogPosts || isLoadingAllBlogPosts || isLoadingArchivedBlogPosts ||
        isFetchingLikedBlogPosts || isFetchingCreatedBlogPosts || isFetchingAllBlogPosts || isFetchingArchivedBlogPosts;

    // ** State to track errors ** \\
    const errors = {
        allPostsError: allBlogPostsIsError && allBlogPostsError && !allBlogPostsIsSuccess,
        createdPostsError: createdBlogPostsIsError && createdBlogPostsError && !createdBlogPostsIsSuccess,
        likedBlogPostsError: likedBlogPostsIsError && likedBlogPostsError && !likedBlogPostsIsSuccess,
        archivedBlogPostsError: archivedBlogPostsIsError && archivedBlogPostsError && !archivedBlogPostsIsSuccess
    };

    // ** Global states that handle blog post data ** \\
    const blogPosts = useAppSelector((state) => state.blogPosts.blogPosts);
    const likedBlogPosts = useAppSelector((state) => state.user.profile.likedBlogPosts);
    const createdBlogPosts = useAppSelector((state) => state.user.profile.createdBlogPosts);
    const archivedBlogPosts = useAppSelector((state) => state.user.profile.archivedBlogPosts);

    // ** Debounce refs ** \\ 
    const allBlogPostsDebounceRef = useRef(
        debounce((page: string, searchQuery: string) => {
            getAllBlogPosts({ page, searchQuery });
        }, 300)
    );

    const createdPostsDebounceRef = useRef(
        debounce((page: string, searchQuery: string) => {
            getCreatedBlogPosts({ page, searchQuery });
        }, 300)
    );

    const likedPostsDebounceRef = useRef(
        debounce((page: string, searchQuery: string) => {
            getLikedBlogPosts({ page, searchQuery });
        }, 300)
    );

    const archivedPostsDebounceRef = useRef(
        debounce((page: string, searchQuery: string) => {
            getArchivedBlogPosts({ page, searchQuery })
        }, 300)
    )

    // ** UseEffect to handle api calls conditionally ** \\
    useEffect(() => {
        allBlogPostsDebounceRef.current.cancel();
        createdPostsDebounceRef.current.cancel();
        likedPostsDebounceRef.current.cancel();
        archivedPostsDebounceRef.current.cancel();

        const cacheBuster = Date.now();

        // ** All blog posts ** \\
        if (activeView === "all-posts") {
            const page = getAllPostsPage();
            if (searchQuery && searchQuery.trim() !== "") {
                allBlogPostsDebounceRef.current(page, searchQuery);
            } else {
                getAllBlogPosts({ page });
            }
        }

        // ** Created blog posts ** \\
        if (activeView === "my-posts") {
            const page = getCreatedPostsPage();
            if (searchQuery && searchQuery.trim() !== "") {
                createdPostsDebounceRef.current(page, searchQuery);
            } else {
                getCreatedBlogPosts({ page, });
            }
        }

        // ** Liked Blog Posts ** \\
        if (activeView === "liked-posts") {
            const page = getLikedPostsPage();
            if (searchQuery && searchQuery.trim() !== "") {
                likedPostsDebounceRef.current(page, searchQuery);
            } else {
                getLikedBlogPosts({ page });
            }
        }
        // ** Archive Blog Posts ** \\
        if (activeView === "archived-posts") {
            const page = getArchivedPostsPage();
            if (searchQuery && searchQuery.trim() !== "") {
                archivedPostsDebounceRef.current(page, searchQuery);
            } else {
                getArchivedBlogPosts({ page });
            }
        }
    }, [
        activeView,
        searchQuery,
        searchParams,
    ]);

    // ** Refs clean up ** \\
    useEffect(() => {
        return () => {
            allBlogPostsDebounceRef.current.cancel();
            createdPostsDebounceRef.current.cancel();
            likedPostsDebounceRef.current.cancel();
            archivedPostsDebounceRef.current.cancel()
        };
    }, []);

    // ** Type for the expected data structure of blog posts coming from backend ** \\
    type ExpectedPaginationPayload = {
        paginationData: PaginationData<BlogPost[]>
    };


    // ** UseEffect to handle successful /failure cases for fetching all blog posts ** \\
    // ** UseEffect to handle successful /failure cases for fetching all blog posts ** \\
    useEffect(() => {
        let isMounted = true;
        const successfullCases = allBlogPostsIsSuccess && !allBlogPostsError && !allBlogPostsError;
        const failureCases = allBlogPostsError && "data" in allBlogPostsError && allBlogPostsIsError && !allBlogPostsIsSuccess;

        if (successfullCases && activeView === "all-posts") { // Add condition
            const typedData = (allBlogPostsData.data as ExpectedPaginationPayload);
            if (isMounted) {
                dispatch(getBlogPosts(typedData.paginationData.data));
                setTotalPages(typedData.paginationData.totalPages);
                scrollToMainDivTop();
            }
        }

        if (failureCases && activeView === "all-posts") { // Add condition
            const typedError = (allBlogPostsError.data as ApiResult);
            if (isMounted) callToast("error", typedError.message);
        }
        return () => { isMounted = false }
    }, [
        allBlogPostsData,
        allBlogPostsError,
        allBlogPostsIsSuccess,
        activeView, // ADD THIS
        dispatch,
        callToast,
    ]);

    // ** UseEffect to handle successful /failure cases for fetching archived blog posts ** \\
    useEffect(() => {
        let isMounted = true;
        const successfullCases = archivedBlogPostsIsSuccess && !archivedBlogPostsIsError && !archivedBlogPostsError;
        const failureCases = !archivedBlogPostsIsSuccess && archivedBlogPostsIsError && archivedBlogPostsError && "data" in archivedBlogPostsError;

        if (successfullCases && activeView === "archived-posts") { // Add condition
            const typedData = (archivedBlogPostsData.data as ExpectedPaginationPayload);
            if (isMounted) {
                dispatch(fetchBlogPosts({
                    blogPosts: typedData.paginationData.data,
                    postType: "archivedBlogPosts"
                }));
                setTotalPages(typedData.paginationData.totalPages);
                scrollToMainDivTop();
            }
        }

        if (failureCases && activeView === "archived-posts") { // Add condition
            const typedError = (archivedBlogPostsError.data as ApiResult);
            if (isMounted) callToast("error", typedError.message);
        }
        return () => { isMounted = false }
    }, [
        archivedBlogPostsIsSuccess,
        archivedBlogPostsIsError,
        archivedBlogPostsError,
        archivedBlogPostsData,
        activeView, // ADD THIS
        dispatch,
        callToast,
    ]);

    // ** UseEffect to handle successful /failure cases for fetching created blog posts ** \\
    useEffect(() => {
        let isMounted = true;
        const successfullCases = createdBlogPostsIsSuccess && !createdBlogPostsError && !createdBlogPostsIsError;
        const failureCases = !createdBlogPostsIsSuccess && createdBlogPostsError && createdBlogPostsIsError && "data" in createdBlogPostsError;

        if (successfullCases && activeView === "my-posts") { // Add condition
            const typedData = (createdBlogPostsData.data as ExpectedPaginationPayload);
            if (isMounted) {
                dispatch(fetchBlogPosts({
                    blogPosts: typedData.paginationData.data,
                    postType: "createdBlogPosts"
                }));
                setTotalPages(typedData.paginationData.totalPages);
                scrollToMainDivTop();
            }
        };

        if (failureCases && activeView === "my-posts") { // Add condition
            const typedError = (createdBlogPostsError.data as ApiResult);
            if (isMounted) callToast("error", typedError.message);
        };

        return () => { isMounted = false };
    }, [
        createdBlogPostsData,
        createdBlogPostsError,
        createdBlogPostsIsError,
        createdBlogPostsIsSuccess,
        activeView, // ADD THIS
        dispatch,
        callToast,
    ]);

    // ** UseEffect to handle successful /failure cases for fetching liked blog posts ** \\
    useEffect(() => {
        let isMounted = true;
        const successfullCases = likedBlogPostsIsSuccess && !likedBlogPostsError && !likedBlogPostsIsError;
        const failureCases = !likedBlogPostsIsSuccess && likedBlogPostsError && likedBlogPostsIsError && "data" in likedBlogPostsError;

        if (successfullCases && activeView === "liked-posts") { // Add condition
            const typedData = (likedBlogPostsData.data as ExpectedPaginationPayload);
            if (isMounted) {
                dispatch(fetchBlogPosts({
                    blogPosts: typedData.paginationData.data,
                    postType: "likedBlogPosts"
                }));
                setTotalPages(typedData.paginationData.totalPages);
                scrollToMainDivTop();
            }
        };

        if (failureCases && activeView === "liked-posts") { // Add condition
            const typedError = (likedBlogPostsError.data as ApiResult);
            if (isMounted) callToast("error", typedError.message);
        };

        return () => { isMounted = false };
    }, [
        likedBlogPostsData,
        likedBlogPostsError,
        likedBlogPostsIsError,
        likedBlogPostsIsSuccess,
        activeView,
        dispatch,
        callToast,
    ]);

    const getTotalPostsConditionally = () => {
        if (activeView === "all-posts") {
            return blogPosts?.length || 0
        }

        if (activeView === "liked-posts") {
            return likedBlogPosts?.length || 0
        }

        if (activeView === "my-posts") {
            return createdBlogPosts?.length || 0
        }

        if (activeView === "archived-posts") {
            return archivedBlogPosts?.length || 0
        }

        return 0
    }

    // ** Helper function to get current page ** \\
    const getCurrentPage = () => {
        if (activeView === "all-posts") return Number(getAllPostsPage());
        if (activeView === "liked-posts") return Number(getLikedPostsPage());
        if (activeView === "my-posts") return Number(getCreatedPostsPage());
        if (activeView === "archived-posts") return Number(getArchivedPostsPage());
        return 1;
    };

    const viewTitles = {
        "all-posts": "Latest Blog Posts",
        "my-posts": "My Posts",
        "liked-posts": "Liked Posts",
        "archived-posts": "Archived Posts"
    };

    const viewDescriptions = {
        "all-posts": "Discover insights and stories from our community",
        "my-posts": "Manage your published content",
        "liked-posts": "Posts you've liked and saved for later",
        "archived-posts": "Posts you've archived and hidden from public view"
    };
    return (
        <div className="min-h-screen w-full bg-white text-gray-900">
            {/* ======= NAVBAR ======= */}
            <PostlyNavbar
                activeView={activeView}
                setActiveView={setActiveView}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />


            {/* ======= MAIN CONTENT ======= */}
            <main ref={mainDivRef} className="max-w-6xl mx-auto py-8 px-6">
                {/* Header Section */}
                <header className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">
                        {viewTitles[activeView] || "Latest Blog Posts"}
                    </h2>
                    <p className="text-gray-600">
                        {viewDescriptions[activeView] || "Discover insights and stories from our community"}
                    </p>
                </header>


                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-sm text-gray-500">
                        Showing {getTotalPostsConditionally()} {getTotalPostsConditionally() === 1 ? 'post' : 'posts'}
                        {searchQuery && ` for "${searchQuery}"`}{" "}
                        {activeView === "liked-posts" ? " in your liked blog posts" :
                            activeView === "my-posts" ? " in your created blog posts" :
                                activeView === "archived-posts" ? "in your archived blog posts" : ""}
                    </p>
                </div>

                {/* Post Feed */}
                {activeView === "all-posts" ? (
                    <PostDisplayArea
                        hasError={errors?.allPostsError}
                        posts={blogPosts || []}
                        isFetchingPosts={isLoadingAllBlogPosts || isFetchingAllBlogPosts}
                        emptyState={{
                            icon: (<Home />),
                            title: "No posts found",
                        }}
                        postDisplayType="all-posts"
                    />
                ) : activeView === "my-posts" ? (
                    <PostDisplayArea
                        hasError={errors?.createdPostsError}
                        posts={createdBlogPosts || []}
                        isFetchingPosts={isLoadingCreatedBlogPosts || isFetchingCreatedBlogPosts}
                        emptyState={{
                            icon: (<CirclePlus />),
                            title: "No created posts found",
                        }}
                    />
                ) : activeView === "archived-posts" ? (
                    <PostDisplayArea
                        hasError={errors?.archivedBlogPostsError}
                        posts={archivedBlogPosts || []}
                        isFetchingPosts={isLoadingArchivedBlogPosts || isFetchingArchivedBlogPosts}
                        emptyState={{
                            icon: (<Archive />),
                            title: "No archived posts found",
                        }}
                    />
                ) : (
                    <PostDisplayArea
                        hasError={errors?.likedBlogPostsError}
                        posts={likedBlogPosts || []}
                        isFetchingPosts={isLoadingLikedBlogPosts || isFetchingLikedBlogPosts}
                        emptyState={{
                            icon: (<Heart />),
                            title: "No liked posts found",
                        }}
                        postDisplayType="liked-posts"
                    />
                )}

                {/* Load More */}
                {
                    (activeView === "my-posts" && createdBlogPosts?.length <= 0) ||
                        (activeView === "liked-posts" && likedBlogPosts?.length <= 0) ||
                        (activeView === "all-posts" && blogPosts?.length <= 0) ||
                        (activeView === "archived-posts") && archivedBlogPosts?.length <= 0 ||
                        (errors.allPostsError || errors.createdPostsError || errors.likedBlogPostsError || errors.archivedBlogPostsError) ? (
                        null
                    ) : (
                        isLoading ? <PaginationSkeleton /> : (
                            <Pagination>
                                <PaginationContent>
                                    {/* Previous Button */}
                                    <PaginationItem >
                                        <PaginationPrevious
                                            className={getCurrentPage() <= 1 ? "opacity-40 cursor-default hover:bg-transparent" : "cursor-pointer"}
                                            onClick={() => {
                                                if (getCurrentPage() <= 1) return;

                                                const newPage = (getCurrentPage() - 1).toString();
                                                if (activeView === "all-posts") {
                                                    updatePageInURL('all-posts', newPage);
                                                } else if (activeView === "liked-posts") {
                                                    updatePageInURL('liked-posts', newPage);
                                                } else if (activeView === "my-posts") {
                                                    updatePageInURL('created-posts', newPage);
                                                } else if (activeView === "archived-posts") {
                                                    updatePageInURL("archived-posts", newPage)
                                                }
                                            }}
                                        />
                                    </PaginationItem>

                                    {/* Page Numbers */}
                                    {Array.from({ length: totalPages }, (_, i: number) => {
                                        const pageNumber = i + 1;
                                        const isActive = pageNumber === getCurrentPage();

                                        return (
                                            <PaginationItem key={pageNumber} className="cursor-pointer">
                                                <PaginationLink
                                                    isActive={isActive}
                                                    onClick={() => {
                                                        if (activeView === "all-posts") {
                                                            updatePageInURL('all-posts', pageNumber.toString());
                                                        } else if (activeView === "liked-posts") {
                                                            updatePageInURL('liked-posts', pageNumber.toString());
                                                        } else if (activeView === "my-posts") {
                                                            updatePageInURL('created-posts', pageNumber.toString());
                                                        } else if (activeView === "archived-posts") {
                                                            updatePageInURL("archived-posts", pageNumber.toString())
                                                        }
                                                    }}
                                                >
                                                    {pageNumber}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    })}

                                    {/* Next Button */}
                                    <PaginationItem className="cursor-pointer">
                                        <PaginationNext
                                            className={`${getCurrentPage() === totalPages ? "cursor-default opacity-40 hover:bg-transparent" : ""}`}
                                            onClick={() => {
                                                if (getCurrentPage() === totalPages) return;

                                                const newPage = (getCurrentPage() + 1).toString();
                                                if (activeView === "all-posts") {
                                                    updatePageInURL('all-posts', newPage);
                                                } else if (activeView === "liked-posts") {
                                                    updatePageInURL('liked-posts', newPage);
                                                } else if (activeView === "my-posts") {
                                                    updatePageInURL('created-posts', newPage);
                                                } else if (activeView === "archived-posts") {
                                                    updatePageInURL("archived-posts", newPage)
                                                }
                                            }}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )
                    )
                }
            </main>
        </div>
    );
};

export default PostsPage;