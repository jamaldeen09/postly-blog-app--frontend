"use client"
import React, { useContext,  useRef } from "react";
import { ActionButton, ActionButtonProps } from "../reusableUi/ActionButton";
import { motion, useInView } from "framer-motion";
import { containerVariants, gradientVariants, itemVariants } from "@/variants/landingPage";
import useTrigger from "@/hooks/useTrigger";
import { AuthContext } from "../landingPageUi/LandingPage";
import useAuth from "@/hooks/useAuth";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";


const Hero = (): React.ReactElement => {
    // ** Ref and boolean to handle animation in view ** \\
    const ref = useRef<HTMLDivElement | null>(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    // ** Custom hooks ** \\
    const { mutateTrigger } = useTrigger();
    const { setAuth } = useContext(AuthContext);
    const { authState } = useAuth();

    // ** Route definition ** \\
    const router = useRouter();

    // ** Action buttons ** \\
    const actionButtons: ActionButtonProps[] = [
        {
            buttonText: "Signup",
            variant: "primary",
            size: "lg",
            funcToExecuteOnClick: () => {
                mutateTrigger("authModal", true);
                return setAuth("signup")
            }
        },
        {
            buttonText: "Login",
            variant: "secondary",
            size: "lg",
            funcToExecuteOnClick: () => {
                mutateTrigger("authModal", true);
                return setAuth("login")
            }
        }
    ];

    return (
        <section
            ref={ref}
            className="h-fit py-52 flex justify-center items-center relative overflow-hidden px-4 sm:px-6"
        >
            {/* Animated Background Elements */}
            <motion.div
                className="absolute inset-0 z-0"
                variants={gradientVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                {/* Subtle Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-size-[40px_40px]" />


                {/* Geometric Pattern */}
                <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#000000_1px,transparent_1px)] bg-size-[20px_20px]" />
            </motion.div>

            {/* Content */}
            <motion.div
                className="text-center space-y-8 w-full lg:max-w-5xl  mx-auto relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                {/* Main Heading with Staggered Letters */}
                <motion.div className="space-y-2">
                    <motion.h1
                        className="font-extrabold text-5xl sm:text-6xl lg:text-7xl text-center mb-4 leading-tight"
                        variants={itemVariants}
                    >
                        Where Every Thought Finds Its Voice
                    </motion.h1>

                </motion.div>

                {/* Subtitle */}
                <motion.div variants={itemVariants}>
                    <h4 className="font-light text-gray-600 text-center leading-relaxed text-lg sm:text-2xl md:text-3xl max-w-4xl mx-auto">
                        Your space to share thoughts, stories, and experiences.
                        <br />
                        <motion.span
                            className="bg-linear-to-r from-gray-900 to-black bg-clip-text text-transparent font-semibold"
                            whileInView={{ opacity: 1, x: 0 }}
                            initial={{ opacity: 0, x: -20 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                        >
                            Write freely. Connect deeply. Inspire others.
                        </motion.span>
                    </h4>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    className="flex justify-center items-center gap-6 pt-4"
                    variants={itemVariants}
                >
                    {authState.isAuthenticated ? (
                        <Button
                            onClick={() => router.push("/postly")}
                            className="cursor-pointer group"
                        >
                            Go to postly dashboard
                            <ArrowRight className="group-hover:translate-x-1 transition-translate duration-200" />
                        </Button>
                    ) : (
                        actionButtons.map((buttonData: ActionButtonProps): React.ReactElement => (
                            <motion.div
                                key={buttonData.variant}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <ActionButton {...buttonData} />
                            </motion.div>
                        ))
                    )}
                </motion.div>

            </motion.div>
        </section>
    );
}

export default Hero
