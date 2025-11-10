const CommentItemSkeleton = () => {
    return (
        <div className="space-y-4 border-gray-200 animate-pulse">
            {/* Main Comment Skeleton */}
            <div className="flex gap-3">
                {/* Avatar Skeleton */}
                <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0"></div>
                
                {/* Content Skeleton */}
                <div className="flex-1 min-w-0 space-y-3">
                    {/* Comment Header Skeleton */}
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                            <div className="h-3 bg-gray-200 rounded w-12"></div>
                        </div>
                        {/* Comment Text Skeleton */}
                        <div className="space-y-1">
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                            <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    </div>
                    
                    {/* Actions Skeleton */}
                    <div className="flex items-center gap-4 px-1">
                        <div className="h-3 bg-gray-200 rounded w-12"></div>
                        <div className="h-3 bg-gray-200 rounded w-10"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default CommentItemSkeleton