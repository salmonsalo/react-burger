import { useLocation, useParams } from "react-router-dom";
import {
  useGetAllOrdersQuery,
  useGetProfileOrdersQuery,
} from "../../services/middleware/websocket-api";
import { IOrder } from "../../utils/api";
import OrderCard from "../../components/order-card/order-card";
import orderPageStyle from "./order-card-page.module.css";

const OrderCardPage = () => {
  const { number } = useParams<{ number: string }>();

  const { data: allOrdersData, isLoading: isLoadingAllOrders } = useGetAllOrdersQuery();
  const { data: profileOrdersData, isLoading: isLoadingProfileOrders } = useGetProfileOrdersQuery();

  const allOrders = allOrdersData?.entities ? Object.values(allOrdersData.entities) : [];
  const profileOrders = profileOrdersData?.entities ? Object.values(profileOrdersData.entities) : [];
  const combinedOrders: IOrder[] = [...allOrders, ...profileOrders];

  if (isLoadingAllOrders || isLoadingProfileOrders) {
      return <p>Loading...</p>;
  }

  if (!number) {
      return <p>Invalid order number</p>;
  }

  const order = combinedOrders.find((order) => order.number.toString() === number);

  if (!order) {
      return <p>Order not found</p>;
  }


  return (
    <div className={orderPageStyle.content}>
      {order ? (
        <OrderCard orderNumber={order.number} ordersData={combinedOrders} />
      ) : (
        <p>Order not found</p>
      )}
    </div>
  );
};

export default OrderCardPage;
