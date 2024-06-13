import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ingredientsApi = createApi({
  reducerPath: "ingredientsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://norma.nomoreparties.space/api/",
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
    // addIngredientToConstructor: builder.mutation({
    //   query: ingredient => ({
    //     url: '/ingredient',
    //     method: 'POST',
    //     body:  ingredient,
    //   })
    // })
  }),
});

export const { useGetIngredientsQuery, useCreateOrderMutation } = ingredientsApi;
