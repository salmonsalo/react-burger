import { useParams } from "react-router-dom";
import {
  useGetAllOrdersQuery,
  useGetProfileOrdersQuery,
} from "../../services/middleware/websocket-api";
import { IOrder } from "../../utils/api";
import OrderCard from "../../components/order-card/order-card";
import orderPageStyle from "./order-card-page.module.css";
import { useGetOrderByIdQuery } from "../../services/burger-ingedients/api";

const OrderCardPage: React.FC = () => {
  const params = useParams<{ number?: string }>();
  const number = params.number;

  const { data: allOrdersData, isLoading: isLoadingAllOrders } =
    useGetAllOrdersQuery();
  const { data: profileOrdersData, isLoading: isLoadingProfileOrders } =
    useGetProfileOrdersQuery();

  const shouldFetchOrderDirectly = number != null;
  const {
    data: restOrderData,
    isLoading: isLoadingRestOrder,
    error: orderError,
  } = useGetOrderByIdQuery(number!, {
    skip: !shouldFetchOrderDirectly,
  });

  const allOrders: IOrder[] = allOrdersData?.entities
    ? Object.values(allOrdersData.entities as Record<string, IOrder>)
    : [];
  const profileOrders: IOrder[] = profileOrdersData?.entities
    ? Object.values(profileOrdersData.entities as Record<string, IOrder>)
    : [];
  let combinedOrders = [...allOrders, ...profileOrders];

  let order = combinedOrders.find(
    (order) => order.number.toString() === number
  );

  if (!order && restOrderData && restOrderData.orders) {
    order = restOrderData.orders.find(
      (order) => order.number.toString() === number
    );
    if (order) {
      combinedOrders = [...combinedOrders, order];
    }
  }

  if (isLoadingAllOrders || isLoadingProfileOrders || isLoadingRestOrder) {
    return (
      <div className={`${orderPageStyle.content} mb-10`}>
        <p className="text text_type_main-default">
          <strong>Загрузка...</strong>
        </p>
      </div>
    );
  }

  if (!number) {
    return (
      <div className={`${orderPageStyle.content} mb-10`}>
        <p className="text text_type_main-default">
          <strong>Неверный номер заказа</strong>
        </p>
      </div>
    );
  }

  if (orderError) {
    const errorMessage =
      (orderError as { message?: string }).message ??
      "Произошла неизвестная ошибка.";
    return (
      <div className={`${orderPageStyle.content} mb-10`}>
        <p className="text text_type_main-default">
          <strong>Ошибка: {errorMessage}</strong>
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={`${orderPageStyle.content} mb-10`}>
        <p className="text text_type_main-default">
          <strong>Заказ не найден</strong>
        </p>
      </div>
    );
  }

  return (
    <div className={orderPageStyle.content}>
      <OrderCard orderNumber={order.number} ordersData={combinedOrders} />
    </div>
  );
};

export default OrderCardPage;
