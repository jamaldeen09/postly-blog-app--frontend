"use client"
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    LogOut,
    User2Icon
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { logout } from "@/redux/slices/userSlice";
import { authApi, useLogoutMutation } from "@/redux/apis/authApi";
import { callToast } from "@/providers/SonnerProvider";
import { ApiResult } from "@/types/auth";
import CustomSpinner from "../reusableUi/CustomSpinner";
import blogPostApi from "@/redux/apis/blogPostApi";
import profileApi from "@/redux/apis/profileApi";

const UserProfileButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const userData = useAppSelector((state) => state.user.profile)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const dispatch = useAppDispatch();

    const [logOutClient, {
        isLoading,
        isError,
        error,
        data,
        isSuccess,
    }] = useLogoutMutation();

    const logUserOut = async () => {
        try {
            return await logOutClient();
        } catch (err) {
            console.error(`Error occured in function "logUserOut" in file "UserProfileButton.tsx": ${err}`);
            return callToast("error", "An unexpected error occured while trying to log you out of your account, please try again shortly");
        }
    };

    useEffect(() => {
        let isMounted = true;
        if (isSuccess && !isError && !error) {
            if (isMounted) {
                dispatch(blogPostApi.util.resetApiState());
                dispatch(profileApi.util.resetApiState());
                dispatch(authApi.util.resetApiState());

                dispatch(logout());
                callToast("success", data.message);
            }
        }

        if (isError && error && "data" in error && !isSuccess) {
            if (isMounted) callToast("error", (error.data as ApiResult).message);
        }
    }, [
        isSuccess,
        isError,
        data,
        error,
        dispatch,
        callToast
    ]);

    return (
        <div className="fixed right-5 bottom-5 z-50">
            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={dropdownRef}
                        className="absolute bottom-16 right-0 w-80 bg-white rounded-xl shadow-md border border-gray-200 p-6 duration-300"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                            <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                {userData.username.charAt(0).toUpperCase() || "P"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 truncate">{userData.username}</h3>
                                <p className="text-sm text-gray-500 truncate">{userData.email}</p>
                            </div>
                        </div>



                        {/* Actions */}
                        <div className="space-y-2">
                            <Button
                                disabled={isLoading}
                                onClick={logUserOut}
                                variant="ghost"
                                className="w-full justify-start gap-3 h-10 text-red-600 hover:bg-red-50 hover:text-red-600
                                cursor-pointer"
                            >
                                {isLoading ? <CustomSpinner className="text-red-600 size-4" /> : <LogOut className="h-4 w-4" />}
                                {isLoading ? "Signing out" : "Sign Out"}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Action Button */}
            <Button
                size="icon-lg"
                onClick={() => setIsOpen(true)}
                className={`w-fit h-fit p-3 rounded-full cursor-pointer transition-all duration-300 bg-gray-900 hover:bg-gray-800 hover:scale-110 shadow-lg`}
            >
                <User2Icon className="size-5" />
            </Button>
        </div>
    );
};

export default UserProfileButton;