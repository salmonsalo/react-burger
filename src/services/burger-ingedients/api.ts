import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth, IOrder, IOrdersResponse } from "../../utils/api";

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
    getOrderById: builder.query<IOrdersResponse, string>({
      query: (number) => {
        return `/orders/${number}`;
      }
    }),
  }),
});

export const { useGetIngredientsQuery, useGetOrderByIdQuery} =
  ingredientsApi;
