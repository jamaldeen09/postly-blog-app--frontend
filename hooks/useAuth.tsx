"use client"

import { AuthState, logout, setAuth } from "@/redux/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";

interface UseAuthReturnType {
  initAuth: (authPayload: { username: string; userId: string }) => void;
  logUserOut: () => void;
  authState: AuthState;
  hasAccessToken: () => boolean;
}

const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.user.authState);

  const hasAccessToken = () => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return false;

      return true;
    }

    return false;
  };

  const initAuth = (authPayload: { username: string; userId: string }) => dispatch(setAuth(authPayload));
  const logUserOut = () => dispatch(logout());

  return { authState, initAuth, logUserOut, hasAccessToken } as UseAuthReturnType
};

export default useAuth;