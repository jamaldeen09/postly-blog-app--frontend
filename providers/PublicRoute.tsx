"use client"
import Loader from "@/components/reusableUi/Loader";
import { useGetAuthStateQuery } from "@/redux/apis/authApi";
import React from "react";

const PublicRoute = React.memo(({ children }: {
    children: React.ReactNode
}): React.ReactElement => {
    // ** Fetches the users auth state when this component mounts ** \\
    const {
        isLoading,
        isFetching,
    } = useGetAuthStateQuery();

    const isPending = isLoading || isFetching;
    if (isPending) {
        return (
            <Loader />
        )
    };

    return <>{children}</>
});

export default PublicRoute;