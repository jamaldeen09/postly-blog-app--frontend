"use client"
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    LogOut,
    User2Icon
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import { logout } from "@/redux/slices/userSlice";

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
    const router = useRouter();
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
                                onClick={() => {
                                    if (typeof window !== "undefined") {
                                        localStorage.removeItem("accessToken");
                                        localStorage.removeItem("refreshToken");
                                        dispatch(logout());
                                        return router.push("/");
                                    }
                                }}
                                variant="ghost"
                                className="w-full justify-start gap-3 h-10 text-red-600 hover:bg-red-50 hover:text-red-600
                                cursor-pointer"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign Out
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