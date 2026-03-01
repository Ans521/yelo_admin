import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://82.180.144.143/api/',
        prepareHeaders: (headers) => {
                const token = localStorage.getItem("token"); 

                if (token) {
                    headers.set("authorization", `Bearer ${token}`);
                }
                return headers;
        },
    }, 
),
    
    endpoints: (builder: any) => ({
        getAllCategory: builder.query({
            query: () => 'get-all-category',
        }),
        addCategories: builder.mutation({
            query: (data: any) => ({
                url: 'categories',
                method: 'POST',
                body: data,
            })
        }),
        updateCategory: builder.mutation({
            query: (data: any) => ({
                url: 'update-category',
                method: 'PUT',
                body: data,
            })
        }),
        getCount : builder.query({
            query : () => 'dash-count'
        })
    }),
})

export const {
    useGetAllCategoryQuery,
    useAddCategoriesMutation,
    useUpdateCategoryMutation,
    useGetCountQuery
} = api;

export default api.reducer;
