import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Archive, AlertTriangle, X } from "lucide-react";
import { useArchiveOrUnArchiveBlogPostMutation, useLazyGetArchivedBlogPostsQuery } from "@/redux/apis/blogPostApi";
import { callToast } from "@/providers/SonnerProvider";
import { ApiResult } from "@/types/auth";
import CustomSpinner from "../reusableUi/CustomSpinner";
import useTrigger from "@/hooks/useTrigger";
import { PaginationContext } from "@/app/postly/layout";
import { useRouter, useSearchParams } from "next/navigation";

const ArchivePostConfirmation = React.memo(({ postId }: { postId: string }): React.ReactElement => {
    const { mutateTrigger } = useTrigger();
    const { setActiveView } = useContext(PaginationContext);
    const [getArchivedBlogPosts] = useLazyGetArchivedBlogPostsQuery()
    
    // ** Add router and search params ** \\
    const router = useRouter();
    const searchParams = useSearchParams();

    const [archiveBlogPost, {
        isLoading,
        isError,
        error,
        isSuccess,
        data
    }] = useArchiveOrUnArchiveBlogPostMutation();

    const handleArchive = async () => {
        try {
            await archiveBlogPost({ postId });
        } catch (err) {
            console.error(`Error archiving post: ${err}`);
            callToast("error", "An unexpected error occurred while archiving the post");
        }
    };

    const handleCancel = () => {
        return mutateTrigger("archivePostConfirmationModal", false);
    };

    // ** Function to update URL when switching to archived posts ** \\
    const switchToArchivedPosts = () => {
        const params = new URLSearchParams(searchParams.toString());
        
        // Remove all page params first to avoid conflicts
        params.delete('all-posts-page');
        params.delete('created-posts-page');
        params.delete('liked-posts-page');
        params.delete('archived-posts-page');
        
        // Set archived posts page to 1
        params.set('archived-posts-page', '1');
        
        // Update URL without page reload
        router.push(`?${params.toString()}`, { scroll: false });
    };

    // ** Handle success/error states **\\
    React.useEffect(() => {
        if (isSuccess) {
            callToast("success", data.message);
            switchToArchivedPosts();
            setActiveView("archived-posts");
            getArchivedBlogPosts({ page: "1", _t: Date.now() })
            mutateTrigger("archivePostConfirmationModal", false)
        }

        if (isError && error && "data" in error) {
            const typedError = error.data as ApiResult;
            callToast("error", typedError.message);
        }
    }, [isSuccess, isError, error, callToast, data]);

    return (
        <div className="flex flex-col h-full rounded-sm">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Archive Post</h2>
                        <p className="text-sm text-gray-500">Confirm your action</p>
                    </div>
                </div>
                <button
                    onClick={handleCancel}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                    <X className="h-4 w-4 text-gray-500" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
                <div className="text-center">
                    <div className="mx-auto w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center mb-4">
                        <Archive className="h-6 w-6 text-yellow-600" />
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Archive this post?
                    </h3>

                    <p className="mb-2">
                        This post will be moved to your archives and will no longer be visible to other users.
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-sm">
                <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex-1 h-11 cursor-pointer"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleArchive}
                    disabled={isLoading}
                    className="flex-1 h-11 cursor-pointer bg-yellow-600 text-white hover:bg-yellow-500"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            Archiving... <CustomSpinner />
                        </div>
                    ) : (
                        "Archive Post"
                    )}
                </Button>
            </div>
        </div>
    );
});

export default ArchivePostConfirmation;