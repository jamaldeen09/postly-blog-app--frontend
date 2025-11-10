import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResult } from "@/types/auth";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:4080/api/v1",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

// ** Base query with automatic refresh on 401 **
export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            const { logout } = await import("./slices/userSlice");
            api.dispatch(logout());
            return result;
        }

        const refreshResult = await baseQuery(
            {
                url: "/auth/refresh",
                method: "GET",
                headers: { "x-refresh-token": refreshToken },
            },
            api,
            extraOptions
        );

        if (refreshResult.data) {
            const typedResult = (refreshResult.data as ApiResult).data as {
                accessToken: string;
            };
            localStorage.setItem("accessToken", typedResult.accessToken);
            result = await baseQuery(args, api, extraOptions);
        } else {
            // LAZY IMPORT HERE TOO
            const { logout } = await import("./slices/userSlice");
            api.dispatch(logout());
        }
    }

    return result;
};