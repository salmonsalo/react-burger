import constuctorStyle from "./burger-constructor.module.css";
import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { useEffect, useState, useRef, useCallback } from "react";
import Modal from "../modal/modal";
import OrderDetails from "../order-details/order-details";
import PropTypes from "prop-types";
import { useCreateOrderMutation } from "../../services/burger-ingedients/api";
import { useDrop, useDrag } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import {
  addIngredients,
  removeIngredients,
  updateBun,
  moveIngredient,
  clearCart,
} from "../../services/burger-constructor/constructorSlice";
import { v4 as uuidv4 } from "uuid";

export default function BurgerConstructor() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const SortableIngredient = ({
    ingredient,
    index,
    moveIngredient,
    handleRemove,
    onDropEnd,
  }) => {
    const ref = useRef(null);
    const dropResultRef = useRef(false);

    const [, drop] = useDrop({
      accept: "ingredient",
      hover: (item) => {
        if (item.index !== index) {
          moveIngredient(item.index, index);
          item = { ...item, index };
        }
      },
    });
    const [{ isDragging }, drag] = useDrag({
      type: "ingredient",
      item: { index },
      end: () => {
        if (!dropResultRef.current) {
          onDropEnd();
        }
        dropResultRef.current = false;
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    drag(drop(ref));

    SortableIngredient.propTypes = {
      ingredient: PropTypes.object,
      index: PropTypes.node,
      moveIngredient: PropTypes.func,
      handleRemove: PropTypes.func,
      onDropEnd: PropTypes.func,
    };

    return (
      <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1, cursor: "move" }}>
        <div
          className={constuctorStyle.element}
          key={`${ingredient._id}-${index}`}
        >
          <DragIcon type="primary" />
          <ConstructorElement
            text={`${ingredient.name}`}
            price={`${ingredient.price}`}
            extraClass="ml-3 mr-3"
            thumbnail={`${ingredient.image_mobile}`}
            handleClose={() => handleRemove(index)}
          />
        </div>
      </div>
    );
  };

  const { ingredients, bun } = useSelector((state) => state.constructorSlice);

  const getTotalPrice = () => {
    let total = 0;
    if (bun) {
      total += bun.price * 2;
    }
    ingredients.forEach((ingredient) => {
      total += ingredient.price;
    });
    return total;
  };

  const totalPrice = getTotalPrice();

  const Dustbin = ({ accept, type, text, className }) => {
    const [localIngredient, setLocalIngredient] = useState([]);

    const handleDrop = (item) => {
      if (item.type === "bun") {
        dispatch(updateBun(item));
      } else if (item.type === "main" || item.type === "sauce") {
        dispatch(addIngredients({ ...item, ingredientId: uuidv4() }));
      }
    };
    const handleRemove = (index) => {
      dispatch(removeIngredients(index));
    };

    useEffect(() => {
      setLocalIngredient(ingredients);
    }, [ingredients]);

    const moveIngredients = useCallback(
      (fromIndex, toIndex) => {
        const updatedIngredients = [...localIngredient];
        updatedIngredients.splice(
          toIndex,
          0,
          updatedIngredients.splice(fromIndex, 1)[0]
        );
        setLocalIngredient(updatedIngredients);
        dispatch(moveIngredient({ fromIndex, toIndex }));
      },
      [localIngredient, dispatch]
    );

    const onDropEnd = () => {
      setLocalIngredient(ingredients);
    };

    const [{ canDrop, isOver }, dropRef] = useDrop(() => ({
      accept: "ingredient",
      drop: (item, monitor) => {
        if (monitor.didDrop()) {
          return;
        }
        handleDrop(item);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }));

    let backgroundColor = "#222";
    if (isOver) {
      backgroundColor = "#4C4CFF";
    } else if (canDrop) {
      backgroundColor = "darkkhaki";
    }

    Dustbin.propTypes = {
      accept: PropTypes.node,
      type: PropTypes.string,
      text: PropTypes.string,
      className: PropTypes.object,
    };

    return (
      <div ref={dropRef} style={{ backgroundColor }} className={className}>
        {accept.includes("bun") ? (
          bun ? (
            <div className={constuctorStyle.element} key={bun._id}>
              <ConstructorElement
                type={type}
                isLocked={true}
                text={`${bun.name} ${text}`}
                price={`${bun.price}`}
                extraClass="ml-3 mr-3"
                thumbnail={`${bun.image_mobile}`}
              />
            </div>
          ) : (
            <div>Выберите булки</div>
          )
        ) : ingredients.length > 0 ? (
          ingredients.map((ingredient, index) => (
            <SortableIngredient
              key={ingredient.ingredientId}
              index={index}
              ingredient={ingredient}
              moveIngredient={moveIngredients}
              handleRemove={handleRemove}
              onDropEnd={onDropEnd}
            />
          ))
        ) : (
          <div>Выберите начинки</div>
        )}
      </div>
    );
  };

  const [orderNumber, setOrderNumber] = useState(null);
  const handleOrder = () => {
    if (!bun) {
      alert("Пожалуйста, добавьте булочку в конструктор");
      return;
    }

    const bunId = bun._id;
    const ingredientIds = ingredients.length
      ? ingredients.map((ingredient) => ingredient._id)
      : [];

    if (!ingredientIds.length) {
      alert("Пожалуйста, добавьте ингредиент в конструктор");
      return;
    }

    const orderData = { ingredients: [bunId, ...ingredientIds, bunId] };

    createOrder(orderData)
      .unwrap()
      .then((data) => {
        const orderNumber = data.order.number;
        setOrderNumber(orderNumber);
        openModal();
      })
      .catch((error) => {
        console.error("Не удалось создать заказ:", error);
      });
  };

  const handleClose = () => {
    closeModal();
    dispatch(clearCart());
  };

  BurgerConstructor.propTypes = {
    _id: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
    image_mobile: PropTypes.string,
  };

  return (
    <section className="ml-10">
      <div className="pt-25">
        <div className="ml-4 mr-4">
          <div className={constuctorStyle.content}>
            <Dustbin
              items={ingredients}
              accept={["bun"]}
              label="bun"
              type="top"
              text="(вверх)"
              className={constuctorStyle.bun_top}
            />
            <div className={constuctorStyle.content_unlocked}>
              <Dustbin
                items={ingredients}
                accept={["main", "sauce"]}
                label="main or sauce"
                className={constuctorStyle.ingredients}
              />
            </div>
            <Dustbin
              items={ingredients}
              accept={["bun"]}
              label="bun"
              type="button"
              text="(низ)"
              className={constuctorStyle.bun_bottom}
            />
            <div className={`${constuctorStyle.payment} mt-6`}>
              <div className={constuctorStyle.price}>
                <p className="text text_type_digits-medium mr-2">
                  {totalPrice}
                </p>
                <CurrencyIcon type="primary" />
              </div>
              <Button
                htmlType="button"
                type="primary"
                size="large"
                extraClass="ml-10 mr-8"
                onClick={handleOrder}
                disabled={isLoading}
              >
                {isLoading ? "В процессе.." : "Оформить заказ"}
              </Button>
              {isModalOpen && (
                <Modal onClose={handleClose}>
                  <OrderDetails order={orderNumber} />
                </Modal>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
