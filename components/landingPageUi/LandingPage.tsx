"use client"
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import useTrigger from "@/hooks/useTrigger";
import Modal from "../reusableUi/Modal";
import Auth from "../authUi/Auth";
import { createContext } from "react";
import PublicRoute from "@/providers/PublicRoute";
import Features from "./Features";
import Footer from "./Footer";
import { useAppSelector } from "@/redux/store";


export const AuthContext = createContext<{
    auth: "signup" | "login",
    setAuth: React.Dispatch<React.SetStateAction<"signup" | "login">>
}>({
    auth: "signup",
    setAuth: () => { },
});


const LandingPage = (): React.ReactElement => {
    // ** Modal ** \\
    const { getTrigger, mutateTrigger } = useTrigger();
    const trigger = getTrigger("authModal");

    const { authState, profile }= useAppSelector((state) => state.user)
    useEffect(() => console.log("CURRENT AUTH STATE: ", authState), [authState]);
    useEffect(() => console.log("CURRENT PROFILE: ", profile), [profile]);

    // ** Context values ** \\
    const [auth, setAuth] = useState<"signup" | "login">("signup");
    return (
        <PublicRoute>
            <AuthContext.Provider
                value={{ auth, setAuth }}
            >
                {/* Navbar */}
                <Navbar />

                {/* Hero */}
                <Hero />

                {/* Features */}
                <Features />

                {/* Footer */}
                <Footer />

                {/* Auth modal */}
                <Modal
                    position="fixed"
                    animationType="scale-into-view"
                    trigger={trigger}
                    triggerName="authModal"
                    funcToMutateTrigger={mutateTrigger}
                    overlayStyles="bg-black/70 z-100 flex justify-center items-center px-4 sm:p-0"
                    modalStyles="bg-white w-full max-w-lg h-fit rounded-sm
border border-gray-200 shadow-lg p-8"
                >
                    <Auth />
                </Modal>

            </AuthContext.Provider>
        </PublicRoute>
    );
};

export default LandingPage;