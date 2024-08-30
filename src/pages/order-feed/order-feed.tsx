import orderFeedStyle from "./order-feed.module.css";
import { useGetAllOrdersQuery } from "../../services/middleware/websocket-api";
import { IOrder } from "../../utils/api";
import {
  IIngredient,
  useGetIngredientsQuery,
} from "../../services/burger-ingedients/api";
import OrderMiniCard from "../../components/order-mini-card/order-mini-card";
import { Outlet } from "react-router-dom";

export default function OrderFeed() {
  const { data: ordersAll, isLoading } = useGetAllOrdersQuery();
  const { data: ingredientsResponse } = useGetIngredientsQuery();
  const ingredientsData: IIngredient[] = ingredientsResponse?.data || [];

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const total = ordersAll?.total ?? 0;
  const totalToday = ordersAll?.totalToday ?? 0;
  const ordersAllArray: IOrder[] =
    ordersAll && ordersAll.entities
      ? (Object.values(ordersAll.entities) as IOrder[])
      : [];

  console.log(ordersAll);
  // Функция для получения последних заказов по статусу
  const getLastOrdersByStatus = (
    orders: IOrder[],
    status: string,
    count: number
  ): IOrder[] => {
    return orders
      .filter((order) => order.status === status)
      .slice(-count)
      .reverse();
  };

  // Функция для разделения массива на две части
  const splitArrayInHalf = (
    array: IOrder[],
    halfSize: number
  ): { firstHalf: IOrder[]; secondHalf: IOrder[] } => {
    return {
      firstHalf: array.slice(0, halfSize),
      secondHalf: array.slice(halfSize, halfSize * 2),
    };
  };
  const lastReadyOrders = getLastOrdersByStatus(ordersAllArray, "done", 10);
  const lastInProgressOrders = getLastOrdersByStatus(
    ordersAllArray,
    "created",
    10
  );

  const readyOrdersSplit = splitArrayInHalf(lastReadyOrders, 5);
  const inProgressOrdersSplit = splitArrayInHalf(lastInProgressOrders, 5);
  // Добавляем функцию для проверки заказа
  const isValidOrder = (order: IOrder): boolean => {
    // const ingredientIds = new Set(order.ingredients);
    const bunCount = order.ingredients.filter((id) =>
      ingredientsData.find(
        (ingredient) => ingredient._id === id && ingredient.type === "bun"
      )
    ).length;
    const otherIngredientsCount = order.ingredients.filter((id) =>
      ingredientsData.find(
        (ingredient) => ingredient._id === id && ingredient.type !== "bun"
      )
    ).length;

    // Проверка на наличие хотя бы двух булочек и одного другого ингредиента
    return bunCount >= 2 && otherIngredientsCount >= 1;
  };

  // Фильтруем заказы перед отображением
  const validOrdersAllArray = ordersAllArray.filter(isValidOrder);

  return (
    <section className={orderFeedStyle.main}>
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          flexDirection: "column",
        }}
      >
        <h2 className="text text_type_main-large mt-10 mb-8">Лента заказов</h2>
        <div className={orderFeedStyle.content}>
          <div className={`${orderFeedStyle.orders} pr-2`}>
            {validOrdersAllArray.map((order: IOrder) => (
              <OrderMiniCard
                key={order._id}
                number={order.number}
                order={order}
                ingredientsData={ingredientsData}
              />
            ))}
          </div>
          <div className={orderFeedStyle.info}>
            <div className={orderFeedStyle.status}>
              <div>
                <p className="text text_type_main-medium mb-6">Готовы</p>
                <div className={orderFeedStyle.columns}>
                  <div className={orderFeedStyle.column}>
                    {readyOrdersSplit.firstHalf.map((order) => (
                      <p
                        key={order._id}
                        className={`${orderFeedStyle.ready} text text_type_digits-default`}
                      >
                        {order.number}
                      </p>
                    ))}
                  </div>
                  <div className={orderFeedStyle.column}>
                    {readyOrdersSplit.secondHalf.map((order) => (
                      <p
                        key={order._id}
                        className={`${orderFeedStyle.ready} text text_type_digits-default`}
                      >
                        {order.number}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <p className="text text_type_main-medium mb-6">В работе</p>
                <div className={orderFeedStyle.columns}>
                  <div className={orderFeedStyle.column}>
                    {inProgressOrdersSplit.firstHalf.map((order) => (
                      <p
                        key={order._id}
                        className="text text_type_digits-default"
                      >
                        {order.number}
                      </p>
                    ))}
                  </div>
                  <div className={orderFeedStyle.column}>
                    {inProgressOrdersSplit.secondHalf.map((order) => (
                      <p
                        key={order._id}
                        className="text text_type_digits-default"
                      >
                        {order.number}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-15 mb-15">
              <p className="text text_type_main-medium">
                Выполнено за все время:
              </p>
              <p className="text text_type_digits-large">{total}</p>
            </div>
            <div>
              <p className="text text_type_main-medium">
                Выполнено за сегодня:
              </p>
              <p className="text text_type_digits-large">{totalToday}</p>
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </section>
  );
}
