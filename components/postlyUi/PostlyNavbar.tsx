"use client"

import React from "react";
import { Button } from "../ui/button";
import { Archive, Heart, Home, Menu, Plus, PlusCircle, Search, User, UserCircleIcon } from "lucide-react";
import { Input } from "../ui/input";
import Image from "next/image";
import useResizer from "@/hooks/useResizer";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ActionButton, ActionButtonProps } from "../reusableUi/ActionButton";
import useTrigger from "@/hooks/useTrigger";
import { useRouter, useSearchParams } from "next/navigation";

interface PostlyNavbarProps {
    setActiveView: React.Dispatch<React.SetStateAction<"all-posts" | "my-posts" | "liked-posts" | "archived-posts">>;
    activeView: "all-posts" | "my-posts" | "liked-posts" | "archived-posts";
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};

const ActionDropdownMenu = React.memo(({ icon, text, funcToExecuteOnClick }: {
    icon: React.ReactElement,
    text: string,
    funcToExecuteOnClick: () => void;
}) => {
    return (
        <DropdownMenuItem onClick={funcToExecuteOnClick}>
            {icon}
            {text}
        </DropdownMenuItem>
    )
})

const PostlyNavbar = React.memo((props: PostlyNavbarProps): React.ReactElement => {

    // ** Router and search params ** \\
    const router = useRouter();
    const searchParams = useSearchParams();

    // ** Custom hook for specific screen size ** \\
    const { isDesiredScreen } = useResizer(1024);

    // ** Custom hook for mutating and getting global trigger states ** \\
    const { mutateTrigger } = useTrigger();

    // ** Function to update URL when switching views ** \\
    const handleViewChange = (newView: "all-posts" | "my-posts" | "liked-posts" | "archived-posts") => {
        // ** First update the active view in state ** \\
        props.setActiveView(newView);

        // ** Then update the URL to reset to page 1 for the new view ** \\
        const params = new URLSearchParams(searchParams.toString());

        // ** Remove all page params first to avoid conflicts ** \\
        params.delete('all-posts-page');
        params.delete('created-posts-page');
        params.delete('liked-posts-page');
        params.delete('archived-posts-page'); 

        // ** Set the current page param to 1 for the new view ** \\
        if (newView === "all-posts") {
            params.set('all-posts-page', '1');
        } else if (newView === "my-posts") {
            params.set('created-posts-page', '1');
        } else if (newView === "liked-posts") {
            params.set('liked-posts-page', '1');
        } else if (newView === "archived-posts") {
            params.set('archived-posts-page', '1');
        }

        // ** Update URL without page reload ** \\
        router.push(`?${params.toString()}`, { scroll: false });
    };


    // ** Dropdown menu data ** \\
    const dropdownMenuData = [
        {
            icon: <Home className="text-black" />,
            text: "All posts",
            funcToExecuteOnClick: () => handleViewChange("all-posts")
        },
        {
            icon: <Heart className="text-black" />,
            text: "Liked posts",
            funcToExecuteOnClick: () => handleViewChange("liked-posts")
        },
        {
            icon: <UserCircleIcon className="text-black" />,
            text: "My posts",
            funcToExecuteOnClick: () => handleViewChange("my-posts")
        },
        {
            icon: <Archive className="h-4 w-4 text-black" />,
            text: "Archived posts",
            funcToExecuteOnClick: () => handleViewChange("archived-posts")
        },
        {
            icon: <PlusCircle className="text-black" />,
            text: "Create post",
            funcToExecuteOnClick: () => mutateTrigger("postCreationModal", true)
        },
    ];

    // ** Action Buttons Data ** \\
    const actionButtonData: ActionButtonProps[] = [
        {
            buttonText: "All Posts",
            icon: <Home className="h-4 w-4" />,
            variant: props.activeView === "all-posts" ? "primary" : "secondary",
            funcToExecuteOnClick: () => handleViewChange("all-posts"),
            size: "sm"
        },

        {
            buttonText: "My Posts",
            icon: <User className="h-4 w-4" />,
            variant: props.activeView === "my-posts" ? "primary" : "secondary",
            funcToExecuteOnClick: () => handleViewChange("my-posts"),
            size: "sm"
        },

        {
            buttonText: "Liked Posts",
            icon: <Heart className="h-4 w-4" />,
            variant: props.activeView === "liked-posts" ? "primary" : "secondary",
            funcToExecuteOnClick: () => handleViewChange("liked-posts"),
            size: "sm"
        },

        {
            buttonText: "Archived Posts",
            icon: <Archive className="h-4 w-4" />,
            variant: props.activeView === "archived-posts" ? "primary" : "secondary",
            funcToExecuteOnClick: () => handleViewChange("archived-posts"),
            size: "sm"
        },

        {
            icon: <Plus className="h-4 w-4" />,
            variant: "secondary",
            funcToExecuteOnClick: () => mutateTrigger("postCreationModal", true),
            size: "sm"
        },
    ]
    return (
        <nav className="w-full border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">

            {/* Centered content (inside navbar) */}
            <div className="max-w-7xl mx-auto px-6 py-4">

                {/* Inner content (responsible for spacing in navbar) */}
                <div className="flex items-center justify-between gap-6 md:gap-10">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Image
                            src="/favicon.svg"
                            alt="postly_logo"
                            width={isDesiredScreen ? 50 : 46}
                            height={isDesiredScreen ? 50 : 46}
                        />
                        <h1 className="text-xl font-bold hidden md:block">Postly</h1>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                value={props.searchQuery}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setSearchQuery(e.target.value)}
                                type="text"
                                placeholder="Search posts..."
                                className="pl-10 pr-4 py-2 border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    {isDesiredScreen ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="cursor-pointer">
                                    <Menu className="size-5" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    {dropdownMenuData.map((data, i: number) => {
                                        return (
                                            <ActionDropdownMenu key={i} {...data} />
                                        )
                                    })}
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-3">
                            {actionButtonData.map((data, i: number) => {
                                return (
                                    <ActionButton key={i} {...data} />
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
});

export default PostlyNavbar;