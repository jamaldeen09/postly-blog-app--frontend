"use client"
import { useEffect, useState } from "react"

const useResizer = (screen: number) => {
    const [isDesiredScreen, setIsDesiredScreen] = useState<boolean>(false);

    useEffect(() => {
        // ** Check immediately on mount and when screen value changes ** \\
        const checkScreenSize = () => {
            setIsDesiredScreen(window.innerWidth <= screen);
        };

        // ** Check immediately ** \\
        checkScreenSize();

        // ** Set up resize listener ** \\
        const handleResize = () => {
            checkScreenSize();
        };

        window.addEventListener("resize", handleResize);
        
        // ** Cleanup ** \\
        return () => window.removeEventListener("resize", handleResize);
    }, [screen]);

    return { isDesiredScreen } as { isDesiredScreen: boolean };
}

export default useResizer;