import React from "react";
import { Pagination, PaginationContent, PaginationItem } from "../ui/pagination";
import { Skeleton } from "../ui/skeleton";

const PaginationSkeleton = (): React.ReactElement => {
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <Skeleton className="h-9 w-20 rounded-md animate-pulse" />
                </PaginationItem>

                <PaginationItem>
                    <Skeleton className="h-9 w-9 rounded-md animate-pulse" />
                </PaginationItem>

                <PaginationItem>
                    <Skeleton className="h-9 w-9 rounded-md animate-pulse bg-primary/20" />
                </PaginationItem>

                <PaginationItem>
                    <Skeleton className="h-9 w-9 rounded-md animate-pulse" />
                </PaginationItem>

                <PaginationItem>
                    <Skeleton className="h-9 w-9 rounded-md animate-pulse" />
                </PaginationItem>

                <PaginationItem>
                    <Skeleton className="h-9 w-20 rounded-md animate-pulse" />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default PaginationSkeleton;