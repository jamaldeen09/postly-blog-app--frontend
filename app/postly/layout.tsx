"use client"
import PostCreation from "@/components/postlyUi/PostCreation";
import PostView from "@/components/postlyUi/PostView";
import Modal from "@/components/reusableUi/Modal";
import UserProfileButton from "@/components/postlyUi/UserProfileButton";
import useTrigger from "@/hooks/useTrigger";
import ProfileProvider from "@/providers/ProfileProvider";
import ProtectedRoute from "@/providers/ProtectedRoute";
import React, { useState } from "react";
import { createContext } from "react";
import ArchivePostConfirmation from "@/components/postlyUi/ArchivePostConfirmation";
import useResizer from "@/hooks/useResizer";


interface PaginationContextType {
  totalPages: number;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  activeView: "all-posts" | "my-posts" | "liked-posts" | "archived-posts";
  setActiveView: React.Dispatch<React.SetStateAction<"all-posts" | "my-posts" | "liked-posts" | "archived-posts">>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  postId: string,
  setPostId: React.Dispatch<React.SetStateAction<string>>;
  totalComments: number;
  setTotalComments: React.Dispatch<React.SetStateAction<number>>;
  archivePostId: string;
  setArchivePostId: React.Dispatch<React.SetStateAction<string>>;
};


// ** Context ** \\
export const PaginationContext = createContext<PaginationContextType>({
  totalPages: 0,
  setTotalPages: () => { },
  activeView: "all-posts",
  setActiveView: () => { },
  searchQuery: "",
  setSearchQuery: () => { },
  postId: "",
  setPostId: () => { },
  totalComments: 0,
  setTotalComments: () => { },
  archivePostId: "",
  setArchivePostId: () => { },
});


const Layout = ({ children }: {
  children: React.ReactNode
}): React.ReactElement => {
  const { getTrigger, mutateTrigger } = useTrigger();
  const [totalPages, setTotalPages] = useState<number>(0);
  const [activeView, setActiveView] = useState<"all-posts" | "my-posts" | "liked-posts" | "archived-posts">("all-posts");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [postId, setPostId] = useState<string>("");
  const [archivePostId, setArchivePostId] = useState<string>("");
  const [totalComments, setTotalComments] = useState<number>(0);
  const { isDesiredScreen } = useResizer(1024)
  return (
    <ProtectedRoute>
      <ProfileProvider>
        <PaginationContext.Provider
          value={{
            totalPages,
            setTotalPages,
            activeView,
            setActiveView,
            searchQuery,
            setSearchQuery,
            postId,
            setPostId,
            totalComments,
            setTotalComments,
            archivePostId,
            setArchivePostId
          }}
        >
          {children}

          {/* Post creation modal */}
          <Modal
            position="fixed"
            animationType="scale-into-view"
            trigger={getTrigger("postCreationModal")}
            overlayStyles="z-100 bg-black/70 min-h-screen flex justify-center items-center"
            modalStyles={`w-full bg-white h-full overflow-y-auto ${isDesiredScreen ? "p-6" : "max-h-[80vh] max-w-2xl p-10"} lg:rounded-sm  element-scrollable-hidden-scrollbar`}
            triggerName="postCreationModal"
            funcToMutateTrigger={mutateTrigger}
          >
            <PostCreation />
          </Modal>

          {/* Archive post confirmation modal */}
          <Modal
            position="fixed"
            animationType="scale-into-view"
            trigger={getTrigger("archivePostConfirmationModal")}
            overlayStyles="z-50 flex justify-center items-center bg-black/70 px-4 md:px-0"
            modalStyles="bg-white rounded-sm w-full max-w-md h-fit"
            triggerName="archivePostConfirmationModal"
            funcToMutateTrigger={mutateTrigger}
          >
            <ArchivePostConfirmation postId={archivePostId} />
          </Modal>

          {/* Single post details modal */}
          <Modal
            position="fixed"
            animationType="top-into-view"
            trigger={getTrigger("postViewModal")}
            overlayStyles="z-[100] bg-black/70 min-h-screen flex justify-center items-center px-0 py-0 lg:px-4 lg:py-10"
            modalStyles="w-full h-full lg:max-h-[90vh] bg-white rounded-none lg:rounded-lg max-w-7xl mx-auto"
            triggerName="postViewModal"
            funcToMutateTrigger={mutateTrigger}

          >
            {getTrigger("postViewModal") && <PostView postId={postId} onClose={() => mutateTrigger("postViewModal", false)} />}
          </Modal>

          {/* User profile button */}
          <UserProfileButton />
        </PaginationContext.Provider>
      </ProfileProvider>
    </ProtectedRoute>
  )
};

export default Layout;