import {
  CurrencyIcon,
  FormattedDate,
} from "@ya.praktikum/react-developer-burger-ui-components";
import orderStyle from "./order-mini-card.module.css";
import { IIngredient } from "../../services/burger-ingedients/api";
import { IOrder } from "../../utils/api";
import { openModalIngredient } from "../../services/burger-ingedients/ingredientModalSlice";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

interface IngredientsComponentProps {
  ingredients: IIngredient[];
  price: number;
}
interface IOrderMiniCardProps {
  number: number;
  order: IOrder;
  ingredientsData: IIngredient[];
}
interface IOrderMiniCardProps {
  number: number;
  name?: string;
  status?: string;
  updatedAt?: string;
  price?: number;
  ingredients?: string[];
  image_mobile?: string;
}

const OrderMiniCard: React.FC<IOrderMiniCardProps> = ({
  order,
  ingredientsData,
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(openModalIngredient(order));
  };

  const path = location.pathname.includes("profile/orders")
    ? `/profile/orders/${order.number}`
    : `/feed/${order.number}`;

  const statusMap: { [key: string]: { text: string; color: string } } = {
    pending: { text: "Отменён", color: "red" },
    done: { text: "Выполнен", color: "#00cccc" },
    created: { text: "В работе", color: "white " },
  };

  const getIngredientsDetails = (ingredientIds: string[]): IIngredient[] => {
    return ingredientIds
      .map(
        (id) =>
          ingredientsData.find(
            (ingredient) => ingredient._id === id
          ) as IIngredient
      )
      .filter((ingredient) => ingredient !== undefined);
  };

  const getTotalPrice = (ingredients: IIngredient[]): number => {
    return ingredients.reduce((acc, ingredient) => acc + ingredient.price, 0);
  };

  const ingredients = getIngredientsDetails(order.ingredients);
  const totalPrice = getTotalPrice(ingredients);

  const IngredientsOrder: React.FC<IngredientsComponentProps> = ({
    ingredients,
    price,
  }) => {
    const maxVisibleIngredients = 6;
    const visibleIngredients = ingredients.slice(0, maxVisibleIngredients);
    const remainingCount = Math.max(
      0,
      ingredients.length - maxVisibleIngredients
    );
    return (
      <div className={orderStyle.info_order}>
        <div className={orderStyle.ingredients}>
          {visibleIngredients.map((ingredient, index) => {
            const isOverlay =
              index === maxVisibleIngredients - 1 && remainingCount > 0;
            return (
              <div
                key={index}
                className={`${orderStyle.ingredient} ${
                  isOverlay ? orderStyle.overlay : ""
                }`}
                style={{ zIndex: maxVisibleIngredients - index }}
              >
                <img
                  src={ingredient.image_mobile}
                  alt={ingredient.name}
                  className={orderStyle.img}
                />
                {isOverlay && <span>+{remainingCount}</span>}
              </div>
            );
          })}
        </div>
        <div className={orderStyle.price}>
          <p className="text text_type_digits-default mr-2">{price}</p>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    );
  };
  return (
    <Link
      key={order.number}
      to={{
        pathname: path,
      }}
      state={{ background: location }}
      onClick={handleClick}
      className={orderStyle.link}
    >
      <div className={`${orderStyle.order} mb-4 p-6`}>
        <div className={orderStyle.info_card}>
          <p className="text text_type_digits-default">#{order.number}</p>
          <FormattedDate
            date={new Date(order.updatedAt)}
            className="text text_type_main-default text_color_inactive"
          />
        </div>
        <p className="text text_type_main-medium mt-6 mb-2">{order.name}</p>
        <p
          className="text text_type_main-default mb-6"
          style={{ color: statusMap[order.status].color }}
        >
          {statusMap[order.status].text}
        </p>
        <IngredientsOrder ingredients={ingredients} price={totalPrice} />
      </div>
    </Link>
  );
};
export default OrderMiniCard;
