// ** Imports ** \\
import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResult } from "@/types/auth";
import { baseQueryWithReauth } from "../apiSettings";

interface AuthCredentials {
    signup: {
        username: string;
        email: string;
        password: string;
    };

    login: Omit<AuthCredentials["signup"], "username">;
}

// ** Api definition ** \\

const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        signup: builder.mutation<ApiResult, AuthCredentials["signup"]>({
            query: (body) => ({
                url: "/auth/signup",
                method: "POST",
                body,
            })
        }),

        login: builder.mutation<ApiResult, AuthCredentials["login"]>({
            query: (body) => ({
                url: "/auth/login",
                method: "POST",
                body,
            }) 
        }),

        

        getAuthState: builder.query<ApiResult, void>({
            query: () => "/auth/me"
        }),
    }),
});


export const {
    useSignupMutation,
    useLoginMutation,
    useGetAuthStateQuery,
} = authApi

export {
    type AuthCredentials,
    authApi
}