"use client"
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../landingPageUi/LandingPage";
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSignupSchema } from "@/hooks/useValidations";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { callToast } from "@/providers/SonnerProvider";
import { Eye, EyeOff, Lock, MailIcon, UserCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import useResizer from "@/hooks/useResizer";
import { useSignupMutation } from "@/redux/apis/authApi";
import useAuth from "@/hooks/useAuth";
import { ApiResult } from "@/types/auth";
import CustomSpinner from "../reusableUi/CustomSpinner";
import { useRouter } from "next/navigation";
import useTrigger from "@/hooks/useTrigger";


const Signup = (): React.ReactElement => {

    const { setAuth } = useContext(AuthContext);
    const { schema } = useSignupSchema();
    const { mutateTrigger } = useTrigger();

    const [
        signup,
        {
            isLoading,
            isError,
            isSuccess,
            error,
            data,
        }
    ] = useSignupMutation();
    const { initAuth } = useAuth();

    const { isDesiredScreen } = useResizer(640);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ field: string, message: string }[]>([]);
    const router = useRouter();


    const signupForm = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
            username: "",
        }
    });

    const signupUser = async (values: z.infer<typeof schema>) => {
        try {
            return await signup({ ...values, email: values.email.toLowerCase() });
        } catch (err) {
            console.error(`Error occured in "signupUser" in file Signup.tsx: ${err}`);
            return callToast("error", "An unexpected error occured while trying to create your account, please try again shortly");
        }
    };



    // ** UseEffect to handle both successful and failure cases upon signup ** \\
    useEffect(() => {
        let isMounted = true;

        // ** Successfull cases ** \\
        if (isSuccess && !isError && !error) {
            if (isMounted) {
                const typedData = data?.data as {
                    auth: { username: string; userId: string };
                    accessToken: string;
                    refreshToken: string;
                };

                // ** Store tokens in local storage ** \\
                if (typeof window !== "undefined") {
                    if (isMounted) {
                        localStorage.setItem("accessToken", typedData?.accessToken);
                        localStorage.setItem("refreshToken", typedData?.refreshToken);
                    }
                };

                // ** After storage set users auth state and route the user to the dashboard ** \\
                if (isMounted) {
                    initAuth(typedData.auth);
                    router.push("/postly")
                    setErrors([]);
                    mutateTrigger("authModal", false)
                }
            }
        }

        // ** Error cases ** \\
        if (isError && error && "data" in error && !isSuccess) {
            const typedError = error?.data as ApiResult;
            const validationErrors = typedError?.data as {
                errors: { field: string, message: string, }[];
            };


            if (isMounted) {
                setErrors(validationErrors?.errors);

            };

            if (validationErrors?.errors?.some((error) => error?.field === "username"
                && error?.message?.includes("A user with that username already exists please use another one"))) {
                if (isMounted) {
                    callToast("error", "A user with that username already exists please use another one");
                };
            } else {
                if (isMounted) callToast("error", typedError.message);
            };
        }
        return () => { isMounted = false }
    }, [isSuccess, isError, data, callToast, error]);

    return (
        <Form {...signupForm}>
            <form
                onSubmit={signupForm.handleSubmit(signupUser)}
                className="space-y-5"
            >

                <header>
                    <div className="text-center">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            Create Your Account
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Sign up to start reading exclusive blog posts and join our community
                        </p>
                    </div>
                </header>

                {/* Extra errors */}
                {errors && errors.length > 0 && (
                    <div
                        className="h-36 p-4 bg-red-100 rounded-xl text-xs text-red-600 space-y-4 overflow-y-auto element-scrollable-hidden-scrollbar"
                    >
                        <h4 className="border-b border-destructive py-2">Validation errors</h4>
                        {errors.map((error, i) => {
                            return <p key={i}>{error.field} - {error.message}</p>
                        })}
                    </div>
                )}

                {/* Form fields */}
                <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => {

                        return (
                            <FormItem>
                                <FormControl>
                                    <div className="relative">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="email"
                                                placeholder={isDesiredScreen ? "Email address" : "Enter your email address"}
                                                className="h-10 pl-9"
                                            />
                                        </FormControl>
                                        <MailIcon className="size-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        );
                    }}
                />

                <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <div className="relative">
                                    <Lock className="size-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type={showPassword ? "text" : "password"}
                                            placeholder={isDesiredScreen ? "Password" : "Create a strong password"}
                                            className="h-10 pr-10 pl-9"
                                        />
                                    </FormControl>
                                    <Button
                                        onClick={() => setShowPassword(!showPassword)}
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="w-fit h-fit p-1.5 cursor-pointer absolute right-1 top-1/2 transform -translate-y-1/2"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        );
                    }}
                />

                <FormField
                    control={signupForm.control}
                    name="username"
                    render={({ field }) => {

                        return (
                            <FormItem>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder={isDesiredScreen ? "Username" : "Create a unique username"}
                                            className="h-10 pl-9"
                                        />
                                    </FormControl>
                                    <UserCircle className="size-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                                </div>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        );
                    }}
                />

                <Button
                    disabled={isLoading}
                    type="submit"
                    className="w-full cursor-pointer"
                >
                    {isLoading ? <CustomSpinner /> : "Continue"}
                </Button>

                <footer
                    className="text-muted-foreground text-sm md:text-xs text-center"
                >
                    <p>Already have an account? <span onClick={() => {
                        if (isLoading) return;

                        return setAuth("login")
                    }} className={`text-blue-600 ${isLoading ? "cursor-not-allowed brightness-75" : "cursor-pointer hover:text-blue-800 "} transition-colors duration-200`}>
                        login here
                    </span>
                    </p>
                </footer>
            </form>
        </Form>
    );
};

export default Signup;