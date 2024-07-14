import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseUrl = "https://norma.nomoreparties.space/api";
export interface IIngredient {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
}
export interface IOrder {
  number: number;
}
export interface ICreateOrderRequest {
  ingredients: { _id: string }[];
}
export interface ICreateOrderResponse {
  name: string;
  success: boolean;
  order: IOrder;
}
export interface IApiResponse {
  data: IIngredient[];
}
export const ingredientsApi = createApi({
  reducerPath: "ingredientsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
  }),
  endpoints: (builder) => ({
    getIngredients: builder.query<IApiResponse, void>({
      query: () => "ingredients",
    }),
    createOrder: builder.mutation<ICreateOrderResponse, ICreateOrderRequest>({
      query: (orderData) => ({
        url: "orders",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      }),
    }),
  }),
});

export const { useGetIngredientsQuery, useCreateOrderMutation } =
  ingredientsApi;
