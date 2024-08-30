import {
  CurrencyIcon,
  FormattedDate,
} from "@ya.praktikum/react-developer-burger-ui-components";
import orderCardStyle from "./order-card.module.css";
import { IOrder } from "../../utils/api";
import {
  IIngredient,
  useGetIngredientsQuery,
} from "../../services/burger-ingedients/api";
import { useMemo } from "react";

interface IIngredientWithQuantity extends IIngredient {
  quantity: number;
}

interface OrderDetailsProps {
  orderNumber: number;
  ordersData: IOrder[];
}

const OrderCard: React.FC<OrderDetailsProps> = ({
  orderNumber,
  ordersData,
}) => {
  const { data: ingredientsResponse, isLoading: isLoadingIngredients } =
    useGetIngredientsQuery();

  const order = ordersData.find((order) => order.number === orderNumber);
  const ingredients = ingredientsResponse?.data as IIngredient[];

  console.log("Order in OrderCard:", order);
  console.log("Ingredients Response:", ingredientsResponse);

  const statusMap: { [key: string]: { text: string; color: string } } = {
    pending: { text: "Отменён", color: "red" },
    done: { text: "Выполнен", color: "#00cccc" },
    created: { text: "В работе", color: "white " },
  };

  const orderIngredients = useMemo(() => {
    if (!order || !ingredients) return [];
    const ingredientCount: { [id: string]: number } = {};

    order.ingredients.forEach((ingredientId) => {
      ingredientCount[ingredientId] = (ingredientCount[ingredientId] || 0) + 1;
    });

    return Object.keys(ingredientCount)
      .map((id) => {
        const ingredient = ingredients.find(
          (ingredient) => ingredient._id === id
        );
        return ingredient
          ? { ...ingredient, quantity: ingredientCount[id] }
          : null;
      })
      .filter(
        (ingredient): ingredient is IIngredientWithQuantity =>
          ingredient !== null
      );
  }, [order, ingredients]);

  if (isLoadingIngredients) {
    return <p>Loading...</p>;
  }

  if (!order) {
    return <p>Order not found</p>;
  }

  const totalPrice = orderIngredients.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className={`${orderCardStyle.card} pl-10 pb-10`}>
        <p
          className={`${orderCardStyle.number} text text_type_digits-default mb-10`}
        >
          {`#${order.number}`}
        </p>
        <p className="text text_type_main-medium mb-3">{order.name}</p>
        <span
          className="text text_type_main-default mb-6"
          style={{ color: statusMap[order.status].color }}
        >
          {statusMap[order.status].text}
        </span>
        <p className="text text_type_main-medium mt-15 mb-6">Состав:</p>
        <div className={orderCardStyle.content}>
          {orderIngredients.map((ingredient) => (
            <div
              key={ingredient._id}
              className={`${orderCardStyle.list} mr-6 mb-4`}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div className={`${orderCardStyle.img_container} mr-4`}>
                  <img
                    src={ingredient.image_mobile}
                    alt={ingredient.name}
                    className={orderCardStyle.img}
                  />
                </div>

                <p className="text text_type_main-default">{ingredient.name}</p>
              </div>
              <div className={orderCardStyle.price}>
                <p className="text text_type_digits-default mr-2">{`${ingredient.quantity} x ${ingredient.price}`}</p>
                <CurrencyIcon type="primary" />
              </div>
            </div>
          ))}
          {/* <div className={`${orderCardStyle.list} mt-10`}>
            <FormattedDate
              date={new Date(order.updatedAt)}
              className="text text_type_main-default text_color_inactive"
            />
            <div className={orderCardStyle.price}>
              <p className="text text_type_digits-default mr-2">{totalPrice}</p>
              <CurrencyIcon type="primary" />
            </div>
          </div> */}
        </div>
        <div className={`${orderCardStyle.list} mt-10`}>
            <FormattedDate
              date={new Date(order.updatedAt)}
              className="text text_type_main-default text_color_inactive"
            />
            <div className={orderCardStyle.price}>
              <p className="text text_type_digits-default mr-2">{totalPrice}</p>
              <CurrencyIcon type="primary" />
            </div>
          </div>
    </div>
  );
};

export default OrderCard;
