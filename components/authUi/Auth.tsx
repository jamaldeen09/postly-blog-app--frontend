import React, { useContext } from "react";
import Signup from "./Signup";
import Login from "./Login";
import { AuthContext } from "../landingPageUi/LandingPage";


const Auth = (): React.ReactElement => {
    const { auth } = useContext(AuthContext);

    const renderAuthComponent = (): React.ReactElement => {
        if (auth === "signup") return <Signup />
        if (auth === "login") return <Login />

        return <Signup />
    }
    return (
        renderAuthComponent()
    );
};

export default Auth;