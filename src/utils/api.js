import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "https://norma.nomoreparties.space/api";
const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("accessToken");
    if (token && !headers.has('Authorization')) {
      headers.set("Authorization", `${token}`);
    }
    return headers;
  },
});

const refreshAuthToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    return null;
  }
  try {
    const response = await fetch(`${baseUrl}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Не удалось обновить токен");
    }

    const data = await response.json();
    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  } catch (error) {
    console.error(error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return null;
  }
};

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (
    result.error &&
    result.error.status === 401 &&
    result.error.data?.message === "jwt expired"
  ) {
    const newAccessToken = await refreshAuthToken();
    if (newAccessToken) {
      const newHeaders = new Headers(args.headers);
      newHeaders.set("Authorization", `Bearer ${newAccessToken}`);
      args = {
        ...args,
        headers: newHeaders,
      };
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const requestPasswordReset = (email) => {
  return fetch(`${baseUrl}/password-reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })
    .then((response) => {
      if (response.ok) {
        return true;
      } else {
        throw new Error("Не удалось запросить сброс пароля");
      }
    })
    .catch((error) => {
      console.error("Ошибка сброса пароля:", error);
      return false;
    });
};

export const resetPassword = (token, password) => {
  return fetch(`${baseUrl}/password-reset/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  })
    .then((response) => {
      if (response.ok) {
        return true;
      } else {
        throw new Error("Не удалось сбросить пароль");
      }
    })
    .catch((error) => {
      console.error("Ошибка сброса пароля:", error);
      return false;
    });
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
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useFetchUserQuery,
  useUpdateUserMutation,
  useLogutUserMutation,
} = apiServise;
