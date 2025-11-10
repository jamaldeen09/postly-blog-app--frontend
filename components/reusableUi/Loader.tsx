"use client"
import UniqueLoader from "./UniqueLoader";

const Loader = (): React.ReactElement => {
    return (
        <div
            className="flex flex-col justify-center items-center h-screen"
        >
            <UniqueLoader />   
            <p className="sr-only">Loading...</p>
        </div>
    );
};

export default Loader;