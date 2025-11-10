"use client"
import { setProfile, User } from "@/redux/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";

interface UseProfileReturnType {
    setUserProfile: (
        data: Omit<User["profile"], "createdBlogPosts">
    ) => void;
    profile: User["profile"];
};


const useProfile = (): UseProfileReturnType => {
    const dispatch = useAppDispatch();
    const profile = useAppSelector((state) => state.user.profile);

    const setUserProfile = (data: Omit<User["profile"], "createdBlogPosts">) => dispatch(setProfile(data));

    return {
        setUserProfile,
        profile,
    }
};

export default useProfile;