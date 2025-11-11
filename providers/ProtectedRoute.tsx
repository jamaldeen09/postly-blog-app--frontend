"use client"
import Loader from "@/components/reusableUi/Loader";
import useAuth from "@/hooks/useAuth";
import { useGetAuthStateQuery } from "@/redux/apis/authApi";
import { useRouter } from "next/navigation";
import React from "react";

const ProtectedRoute = React.memo(({ children }: {
    children: React.ReactNode
}): React.ReactElement => {

    // ** Custom auth hook ** \\
    const { authState } = useAuth();

    // ** Router initialization ** \\
    const router = useRouter();

    // ** Fetches the users auth state when this component mounts ** \\
    const {
        isLoading,
        isFetching,
    } = useGetAuthStateQuery();


    const isPending = isLoading || isFetching;
    React.useEffect(() => {
        if (!isPending && !authState.isAuthenticated) {
            router.push("/");
        }
    }, [isPending, authState.isAuthenticated]);

    
    if ((isLoading || isFetching) || !authState.isAuthenticated) {
        return (
            <Loader />
        )
    };

    return <>{children}</>
});

export default ProtectedRoute;