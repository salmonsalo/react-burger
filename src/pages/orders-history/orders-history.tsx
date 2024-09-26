import OrderMiniCard from "../../components/order-mini-card/order-mini-card";
import { useGetIngredientsQuery } from "../../services/burger-ingedients/api";
import { IIngredient } from "../../services/burger-ingedients/api";
import { useGetProfileOrdersQuery } from "../../services/middleware/websocket-api";
import orderHistioryStyle from "./orders-history.module.css";

export default function OrdersHistory() {
  const {
    data: ordersProfileData,
    isLoading,
    error,
  } = useGetProfileOrdersQuery();
  const { data: ingredientsResponse } = useGetIngredientsQuery();
  const ingredientsData: IIngredient[] = ingredientsResponse?.data || [];

  if (isLoading) {
    return (
      <div className={orderHistioryStyle.message}>
        <p className="text text_type_main-default">Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={orderHistioryStyle.message}>
        <p className="text text_type_main-default">
          Ошибка загрузки данных. Обновите токен.
        </p>
      </div>
    );
  }

  const sortedOrdersArray = ordersProfileData?.entities
    ? Object.values(ordersProfileData.entities).sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    : [];

  return (
    <div className={`${orderHistioryStyle.content} mt-10 pr-2`}>
      {sortedOrdersArray.length > 0 ? (
        sortedOrdersArray.map((order) => (
          <OrderMiniCard
            key={order._id}
            number={order.number}
            order={order}
            ingredientsData={ingredientsData}
          />
        ))
      ) : (
        <div className={orderHistioryStyle.message}>
          <p className="text text_type_main-default">
            Нет заказов для отображения.
          </p>
        </div>
      )}
    </div>
  );
}
