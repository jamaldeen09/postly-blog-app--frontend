import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import React from "react";
interface CustomToolTipProps {
    children: React.ReactNode;
    content: string | React.ReactElement;
    side?:  "right" | "top" | "bottom" | "left"  
}

const CustomToolTip = ({ children, content, side }: CustomToolTipProps) => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent side={side}>
                {content}
            </TooltipContent>
        </Tooltip>
    )
}

export default CustomToolTip