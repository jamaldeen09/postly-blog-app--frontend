"use client"
// ** Imports (client component) ** \\
import { setTrigger, Triggers } from "@/redux/slices/triggersSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";


// ** Custom hook ** \\
const useTrigger = () => {
    // ** Dispatch  initialization ** \\
    const dispatch = useAppDispatch();


    // ** Custom function to change desired trigger ** \\
    const mutateTrigger = (
        key: keyof Triggers,
        value: boolean,
    ) => {
    
        return dispatch(setTrigger({ key, value }));
    }

    // ** Custom function to get a trigger ** \\
    const getTrigger = (name: keyof Triggers) => {
        return useAppSelector((state) => state.triggers[name]);
    };
    return { mutateTrigger, getTrigger } as {
        mutateTrigger: (key: keyof Triggers,
            value: boolean,) => void;
        
        getTrigger: (name: keyof Triggers) => boolean;
    }
}

// ** Export ** \\
export default useTrigger;

