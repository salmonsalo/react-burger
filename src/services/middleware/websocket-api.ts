import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import { refreshAuthToken } from "../../utils/api";
import { IOrder, IOrdersResponse } from "../../utils/api";

export interface OrdersState extends EntityState<IOrder, string> {
  total: number;
  totalToday: number;
}

export const ordersAdapter = createEntityAdapter<IOrder, string>({
  selectId: (order) => order._id,
  sortComparer: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
});

export const initialOrdersState: OrdersState = ordersAdapter.getInitialState({
  total: 0,
  totalToday: 0,
});

export function ordersResponseToEntityState(
  response: IOrdersResponse
): OrdersState {
  const initialState = ordersAdapter.getInitialState();
  const stateWithOrders = ordersAdapter.setAll(initialState, response.orders);

  return {
    ...stateWithOrders,
    total: response.total,
    totalToday: response.totalToday,
  };
}

const connectWebSocketWithToken = (
  url: string,
  token: string,
  updateCachedData: any
) => {
  const socket = new WebSocket(`${url}?token=${token}`);
  setupWebSocketEvents(socket, updateCachedData, url, token);
  return socket;
};

const connectWebSocketWithoutToken = (url: string, updateCachedData: any) => {
  const socket = new WebSocket(url);
  setupWebSocketEvents(socket, updateCachedData, url);
  return socket;
};

const setupWebSocketEvents = (
  socket: WebSocket,
  updateCachedData: any,
  url: string,
  token?: string
) => {
  const onMessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      if (Array.isArray(data.orders)) {
        updateCachedData((draft: OrdersState) => {
          ordersAdapter.setAll(draft, data.orders);
          draft.total = data.total;
          draft.totalToday = data.totalToday;
        });
      } else if (data._id) {
        updateCachedData((draft: OrdersState) => {
          ordersAdapter.upsertOne(draft, data as IOrder);
        });
      } else {
        console.error(
          "Непредвиденный формат данных, полученный от WebSocket:",
          data
        );
      }
    } catch (error) {
      console.error(
        "Ошибка анализа сообщения WebSocket в формате JSON:",
        event.data,
        error
      );
    }
  };

  const onError = async (errorEvent: Event) => {
    console.error("Ошибка WebSocket:", errorEvent);
    const error = (errorEvent as any).message ?? "Неизвестная ошибка";
    if (error === "Недействительный или отсутствующий токен" && token) {
      const newTokenWithBearer = await refreshAuthToken();
      if (newTokenWithBearer) {
        let newToken = newTokenWithBearer;
        if (newToken.startsWith("Bearer ")) {
          newToken = newToken.slice(7);
        }
        socket.close();
        connectWebSocketWithToken(url, newToken, updateCachedData);
      } else {
        console.error("Ошибка аутентификации");
      }
    } else {
      console.error("Произошла ошибка WebSocket:", error);
    }
  };

  const onClose = (event: CloseEvent) => {
    if (event.wasClean) {
      console.error(
        `Closed connection cleanly: code=${event.code} reason=${event.reason}`
      );
    } else {
      console.error("Connection died");
    }
  };

  socket.addEventListener("message", onMessage);
  socket.addEventListener("error", onError);
  socket.addEventListener("close", onClose);
};

const webSocketBaseQuery: BaseQueryFn<void> = async () => ({ data: {} });

export const ordersApi = createApi({
  baseQuery: webSocketBaseQuery,
  endpoints: (build) => ({
    getProfileOrders: build.query<OrdersState, void>({
      query: () => "",
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        let token = localStorage.getItem("accessToken") ?? "";
        if (token.startsWith("Bearer ")) {
          token = token.slice(7);
        }
        const socket = connectWebSocketWithToken(
          "wss://norma.nomoreparties.space/orders",
          token,
          updateCachedData
        );
        try {
          await cacheDataLoaded;
        } catch (error) {
          console.error("Не удалось загрузить данные кэша:", error);
        }
        await cacheEntryRemoved;
        socket.close();
      },
    }),
    getAllOrders: build.query<OrdersState, void>({
      query: () => "",
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const socket = connectWebSocketWithoutToken(
          "wss://norma.nomoreparties.space/orders/all",
          updateCachedData
        );
        try {
          await cacheDataLoaded;
        } catch (error) {
          console.error("Не удалось загрузить данные кэша:", error);
        }
        await cacheEntryRemoved;
        socket.close();
      },
    }),
  }),
});

export const { useGetProfileOrdersQuery, useGetAllOrdersQuery } = ordersApi;
