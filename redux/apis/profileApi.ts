// ** Imports ** \\
import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResult } from "@/types/auth";
import { baseQueryWithReauth } from "../apiSettings";


// ** Api definition ** \\
const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getProfile: builder.query<ApiResult, void>({
            query: () => "/profile/me"
        }),
    }),
});


export const {
    useGetProfileQuery
} = profileApi

export default profileApi