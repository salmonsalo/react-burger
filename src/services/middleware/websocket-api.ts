import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import {
  BaseQueryFn,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { refreshAuthToken } from "../../utils/api";
import { IOrder, IOrdersResponse } from "../../utils/api";

export interface OrdersState extends EntityState<IOrder, string> {
  total: number;
  totalToday: number;
}
// Step 1: Setup Entity Adapter and Initial State
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
      console.log("WebSocket message received:", data);

      if (Array.isArray(data.orders)) {
        // Массовое обновление заказов
        console.log("Orders received:", data.orders);
        updateCachedData((draft: OrdersState) => {
          console.log("Updating cached data with orders...");
          ordersAdapter.setAll(draft, data.orders);
          draft.total = data.total;
          draft.totalToday = data.totalToday;
          console.log("Cache update successful");
        });
      } else if (data._id) {
        // Одиночный заказ
        console.log("Single order received:", data);
        updateCachedData((draft: OrdersState) => {
          console.log("Updating cached data with single order...");
          ordersAdapter.upsertOne(draft, data as IOrder);
          console.log("Cache update successful");
        });
      } else {
        console.error("Unexpected data format received from WebSocket:", data);
      }
    } catch (error) {
      console.error(
        "Error parsing WebSocket message as JSON:",
        event.data,
        error
      );
    }
  };

  const onError = async (errorEvent: Event) => {
    console.error("WebSocket Error:", errorEvent);
    const error = (errorEvent as any).message ?? "Unknown error";
    if (error === "Invalid or missing token" && token) {
      const newTokenWithBearer = await refreshAuthToken();
      if (newTokenWithBearer) {
        let newToken = newTokenWithBearer;
        if (newToken.startsWith("Bearer ")) {
          newToken = newToken.slice(7);
        }
        socket.close();
        connectWebSocketWithToken(url, newToken, updateCachedData);
      } else {
        console.error("Authentication error");
      }
    } else {
      console.error("WebSocket error occurred:", error);
    }
  };

  const onClose = (event: CloseEvent) => {
    if (event.wasClean) {
      console.log(
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

// Step 5: Setup a Base Query Function
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
          console.error("Failed to load cache data:", error);
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
          console.error("Failed to load cache data:", error);
        }
        await cacheEntryRemoved;
        socket.close();
      },
    }),
  }),
});

export const { useGetProfileOrdersQuery, useGetAllOrdersQuery } = ordersApi;
