import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseUrl = "https://norma.nomoreparties.space/api";

export const ingredientsApi = createApi({
  reducerPath: "ingredientsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
  }),
  endpoints: (builder) => ({
    getIngredients: builder.query({
      query: () => "ingredients",
    }),
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: 'orders',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData),
      })
    })
  }),
});

export const { useGetIngredientsQuery, useCreateOrderMutation, useLazyGetIngredientsIdQuery } = ingredientsApi;
