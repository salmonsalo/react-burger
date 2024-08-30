import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../services/burger-ingedients/api";
interface IRequestInitHeaders extends RequestInit {
  headers: Headers;
}
export interface IOrder {
  _id: string; 
  status: string;
  name: string;
  number: number;
  createdAt: string;
  updatedAt: string;
  ingredients: string[];
}

export interface IOrdersResponse {
  success: boolean;
  orders: IOrder[];
  total: number;
  totalToday: number;
}
export interface ICreateOrderRequest {
  ingredients: { _id: string }[];
}
export interface ICreateOrderResponse {
  name: string;
  success: boolean;
  order: IOrder;
}

export const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("accessToken");
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `${token}`);
    }
    return headers;
  },
});

function checkResponse(res: Response) {
  if (!res.ok) {
    return res.json().then((errorData) => {
      throw new Error(errorData.message || "Произошла ошибка");
    });
  }
  return res.json();
}

function request(url: string, options: IRequestInitHeaders) {
  return fetch(url, options)
    .then(checkResponse)
    .catch((error) => {
      console.error(error.message);
      throw error;
    });
}
export const refreshAuthToken = () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    return Promise.resolve(null);
  }
  return request(`${baseUrl}/auth/token`, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({ refreshToken }),
  })
    .then((data) => {
      localStorage.setItem("accessToken", data.accessToken);
      return data.accessToken;
    })
    .catch(() => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return null;
    });
};


export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (
    result.error &&
    result.error.status === 401 &&
    (result.error.data as { message: string })?.message === "jwt expired"
  ) {
    const newAccessToken = await refreshAuthToken();
    if (newAccessToken) {
      if (typeof args === 'string') {
        args = {
          url: args,
          headers: new Headers({
            Authorization: `Bearer ${newAccessToken}`,
          }),
        };
      } else {
        let newHeaders: Headers;
        if (args.headers instanceof Headers) {
          newHeaders = new Headers(args.headers);
        } else if (Array.isArray(args.headers)) {
          newHeaders = new Headers();
          args.headers.forEach(([key, value]) => newHeaders.set(key, value));
        } else {
          newHeaders = new Headers();
          if (typeof args.headers === 'object' && args.headers !== null) {
            Object.entries(args.headers).forEach(([key, value]) => {
              if (value !== undefined) {
                newHeaders.set(key, value as string);
              }
            });
          }
        }
        newHeaders.set('Authorization', `Bearer ${newAccessToken}`);
        args = { ...args, headers: newHeaders };
      }

      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};


export const requestPasswordReset = (email: string) => {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  return request(`${baseUrl}/password-reset`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ email }),
  })
    .then(() => true)
    .catch(() => false);
};

export const resetPassword = (token: string, password: string) => {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  return request(`${baseUrl}/password-reset/reset`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ token, password }),
  })
    .then(() => true)
    .catch(() => false);
};

export const apiServise = createApi({
  reducerPath: "apiServise",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: ({ email, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password },
        headers: { "Content-Type": "application/json" },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
        } catch (error) {
          console.error(error);
        }
      },
    }),
    registerUser: builder.mutation({
      query: ({ name, email, password }) => ({
        url: "/auth/register",
        method: "POST",
        body: { name, email, password },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
        } catch (error) {
          console.error(error);
        }
      },
    }),
    updateUser: builder.mutation({
      query: (userData) => ({
        url: "/auth/user",
        method: "PATCH",
        body: userData,
      }),
    }),
    fetchUser: builder.query({
      query: () => ({
        url: "/auth/user",
        method: "GET",
      }),
    }),
    logutUser: builder.mutation({
      query: ({ token }) => ({
        url: "/auth/logout",
        method: "POST",
        body: { token },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
          } else {
            console.error("Произошла ошибка при выходе:", data.message);
          }
        } catch (error) {
          console.error("Ошибка при взаимодейсвтии с сервером:", error);
        }
      },
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

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useFetchUserQuery,
  useUpdateUserMutation,
  useLogutUserMutation,
  useCreateOrderMutation
} = apiServise;
