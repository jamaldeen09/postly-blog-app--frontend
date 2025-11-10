"use client"
import React from "react";
import { Toaster } from "sonner"
import { toast } from "sonner";

const SonnerProvider = ({ children }: {
    children: React.ReactNode
}): React.ReactElement => {
    return (
        <>
            <Toaster
                richColors
                position="top-right"
                style={{ fontFamily: "poppins" }}
            />
            {children}
        </>
    );
};

const callToast = (
    variant: "success" | "error" | "info" | "warning",
    message: string,
    duration?: number,
) => {
    const effectiveDuration = duration || 3000;

    toast[variant](message, {
        duration: effectiveDuration,
    });
};

export { SonnerProvider, callToast };