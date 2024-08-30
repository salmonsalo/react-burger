import OrderMiniCard from "../../components/order-mini-card/order-mini-card";
import { useGetIngredientsQuery } from "../../services/burger-ingedients/api";

import { IIngredient } from "../../services/burger-ingedients/api";
import { IOrder } from "../../utils/api";
import {
  ordersAdapter,
  ordersResponseToEntityState,
  useGetProfileOrdersQuery,
} from "../../services/middleware/websocket-api";
import orderHistioryStyle from "./orders-details.module.css";

export default function OrdersHistory() {
  const { data: ordersProfileData, isLoading } = useGetProfileOrdersQuery();
  const { data: ingredientsResponse } = useGetIngredientsQuery();
  const ingredientsData: IIngredient[] = ingredientsResponse?.data || [];

  console.log(ordersProfileData);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const ordersArray: IOrder[] =
    ordersProfileData && ordersProfileData.entities
      ? (Object.values(ordersProfileData.entities) as IOrder[])
      : [];
  const sortedOrdersArray = [...ordersArray].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className={`${orderHistioryStyle.content} mt-10 pr-2`}>
      {sortedOrdersArray.map((order: IOrder) => (
        <OrderMiniCard
          key={order._id}
          number={order.number}
          order={order}
          ingredientsData={ingredientsData}
        />
      ))}
    </div>
  );
}
