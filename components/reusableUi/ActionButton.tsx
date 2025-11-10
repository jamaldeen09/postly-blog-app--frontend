"use client"
import { Button } from "../ui/button";
   
interface ActionButtonProps {
    buttonText?: string;
    variant: "primary" | "secondary";
    className?: string;
    size?: "default" | "icon-lg" | "icon-sm" | "sm" | "lg";
    icon?: React.ReactElement;
    funcToExecuteOnClick: () => void;
}

const ActionButton = (props: ActionButtonProps): React.ReactElement => {
    
    return (
        <Button
            size={props.size}
            onClick={props.funcToExecuteOnClick}
            variant={props.variant === "primary" ? "default" : "outline"}
            className={`${props.className} cursor-pointer`}
        >
            {props.icon}
            {props.buttonText}
        </Button>
    )
}

export { ActionButton, type ActionButtonProps}