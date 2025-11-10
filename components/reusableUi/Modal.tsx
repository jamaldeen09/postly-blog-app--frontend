"use client"

import { Triggers } from "@/redux/slices/triggersSlice";
// ** Imports (client component) ** \\
import { AnimatePresence, motion } from "framer-motion";
import React from "react";


// ** Modal component + props type ** \\
interface ModalProps {
    position?: "absolute" | "fixed";
    children: React.ReactNode;
    trigger: boolean;
    triggerName: keyof Triggers;
    funcToMutateTrigger: (key: keyof Triggers,
        value: boolean,) => void;
    animationType: "scale-into-view" | "bottom-into-view" | "top-into-view" | "right-into-view" | "left-into-view";
    overlayStyles?: string;
    modalStyles?: string;
}


// ** Component ** \\
const Modal = React.memo((props: ModalProps): React.ReactElement => {

    React.useEffect(() => {
        if (props.trigger) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        };

        return () => {
            document.body.style.overflow = ""
        }
    }, [props.trigger]);


    const getModalAnimation = () => {
        if (props.animationType === "scale-into-view") {
            return {
                initial: { scale: 0.9, opacity: 0, },
                animate: { scale: 1, opacity: 1 },
                exit: { scale: 0.9, opacity: 0 },
            }
        }

        if (props.animationType === "top-into-view") {
            return {
                initial: { y: -40, opacity: 0, },
                animate: { y: 0, opacity: 1 },
                exit: { y: 40, opacity: 0, },
            }
        }

        if (props.animationType === "bottom-into-view") {
            return {
                initial: { y: 40, opacity: 0, },
                animate: { y: 0, opacity: 1 },
                exit: { y: -40, opacity: 0, },
            }
        }

        if (props.animationType === "left-into-view") {
            return {
                initial: { x: -40, opacity: 0, },
                animate: { x: 0, opacity: 1 },
                exit: { x: -40, opacity: 0, },
            }
        }


        if (props.animationType === "right-into-view") {
            return {
                initial: { x: 40, opacity: 0, },
                animate: { x: 0, opacity: 1 },
                exit: { x: 40, opacity: 0, },
            }
        }

        return {
            initial: { scale: 0.9, opacity: 0, },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.9, opacity: 0 },
        }
    };

    const animation = getModalAnimation();
    return (
        <AnimatePresence>
            {props.trigger && (
                // ** Overlay ** \\
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`${props.overlayStyles} ${props.position} inset-0 `}
                    onClick={() => props.funcToMutateTrigger(props.triggerName, false)}
                >
                    {/* Modal */}
                    <motion.div
                        initial={animation.initial}
                        animate={animation.animate}
                        exit={animation.exit}
                        transition={{ duration: 0.2 }}
                        className={props.modalStyles}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                        {props.children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
});

export default Modal;