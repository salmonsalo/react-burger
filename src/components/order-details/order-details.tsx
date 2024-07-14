import done from "../../images/done.svg";
import { orderDetailsType } from "../../utils/types";
import orderDetailsStyle from "./order-details.module.css";

interface IOrder {
  order: number | null;
}
export default function OrderDetails({ order }: IOrder) {
  return (
    <div className={orderDetailsStyle.content}>
      <h2 className="text text_type_digits-large mt-20 mb-8">{order}</h2>
      <p className="text text_type_main-medium">идентификатор заказа</p>
      <img className="mt-15 mb-15" src={done} alt="идентификатор заказа" />
      <p className="text text_type_main-default mb-2">
        Ваш заказ начали готовить
      </p>
      <p className="text text_type_main-default text_color_inactive mb-5">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
}

OrderDetails.propTypes = orderDetailsType.isRequired;
