import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../utils/api";

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
  }),
});

export const { useGetIngredientsQuery} =
  ingredientsApi;
