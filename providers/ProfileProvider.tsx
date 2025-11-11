"use client"
import useAuth from "@/hooks/useAuth";
import useProfile from "@/hooks/useProfile";
import { useGetProfileQuery } from "@/redux/apis/profileApi";
import { User } from "@/redux/slices/userSlice";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const ProfileProvider = React.memo(({ children }: {
    children: React.ReactNode
}): React.ReactElement => {

    const {
        isLoading,
        isFetching,
        isError,
        error,
        isSuccess,
        data,
    } = useGetProfileQuery();

    const { setUserProfile } = useProfile();
    const { authState } = useAuth();

    const router = useRouter();

    React.useEffect(() => {
        let isMounted = true;

        if (isSuccess && !isError && !error) {
            const typedData = (data.data as { profile: Omit<User["profile"], "createdBlogPosts"> });
            if (isMounted)  {
                setUserProfile(typedData?.profile);
            }
        };

        if (!isSuccess && isError && error && "data" in error) {
            if (isMounted) router.push("/");
        };
    }, [isError, isSuccess, error, data]);

    const isPending = isLoading || isFetching;

    if (isPending || !authState.isAuthenticated) {
        return (<Loader />)
    };


    return <>{children}</>
});

export default ProfileProvider;