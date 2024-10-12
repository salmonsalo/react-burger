import constuctorStyle from "./burger-constructor.module.css";
import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { useEffect, useState, useRef, useCallback, useMemo, FC } from "react";
import Modal from "../modal/modal";
import OrderDetails from "../order-details/order-details";
import { IIngredient } from "../../services/burger-ingedients/api";
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
import { useAuth } from "../auth-provider/auth-provider";
import { useLocation, useNavigate } from "react-router-dom";
import { IIngredientWithOriginalId } from "../../services/burger-constructor/constructorSlice";
import { useCreateOrderMutation } from "../../utils/api";

interface DragItem {
  ingredientId: string;
  uniqueId?: string;
}

interface Props {
  ingredient: IIngredient;
  moveIngredient: (fromId: string, toId: string) => void;
  handleRemove: (_id: string) => void;
  onDropEnd: () => void;
  ingredientId: string;
}
interface DustbinProps {
  accept: string[];
  type?: "top" | "bottom" | "default";
  text?: string;
  className?: string;
  items?: IIngredient[];
  label?: string;
}

interface ConstructorSliceState {
  ingredients: IIngredient[];
  bun: IIngredient | null;
}
interface ICreateOrderRequest {
  ingredients: { _id: string }[];
}

interface RootState {
  constructorSlice: ConstructorSliceState;
}

export default function BurgerConstructor() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingOverride, setIsLoadingOverride] = useState(false);
  const dispatch = useDispatch();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const SortableIngredient: FC<Props> = ({
    ingredient,
    moveIngredient,
    handleRemove,
    onDropEnd,
    ingredientId,
  }) => {
    const ref = useRef(null);
    const dropResultRef = useRef(false);

    const [, drop] = useDrop({
      accept: "ingredient",
      hover: (draggingItem: DragItem) => {
        const item = { ...draggingItem };
        if (item.ingredientId !== ingredientId) {
          moveIngredient(item.ingredientId, ingredientId);
          item.ingredientId = ingredientId;
          dropResultRef.current = true;
        }
      },
    });
    const [{ isDragging }, drag] = useDrag({
      type: "ingredient",
      item: { ingredientId },
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

    return (
      <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1, cursor: "move" }}>
        <div className={constuctorStyle.element}>
          <DragIcon type="primary" />
          <ConstructorElement
            text={`${ingredient.name}`}
            price={ingredient.price}
            extraClass="ml-3 mr-3"
            thumbnail={`${ingredient.image_mobile}`}
            handleClose={() => handleRemove(ingredientId)}
          />
        </div>
      </div>
    );
  };

  const { ingredients, bun } = useSelector(
    (state: RootState) => state.constructorSlice
  );

  const totalPrice = useMemo(() => {
    let total = 0;
    if (bun) {
      total += bun.price * 2;
    }
    ingredients.forEach((ingredient: IIngredient) => {
      total += ingredient.price;
    });

    return total;
  }, [ingredients, bun]);

  const Dustbin: FC<DustbinProps> = ({ accept, type, text, className }) => {
    const [localIngredient, setLocalIngredient] = useState<
      IIngredientWithOriginalId[]
    >([]);

    const transformIngredients = (
      ingredients: IIngredient[]
    ): IIngredientWithOriginalId[] => {
      return ingredients.map((ingredient) => ({
        ...ingredient,
        uniqueId: uuidv4(),
      }));
    };

    useEffect(() => {
      const transformedIngredients = transformIngredients(ingredients);
      setLocalIngredient(transformedIngredients);
    }, [ingredients]);

    const handleDrop = (item: IIngredient) => {
      if (item.type === "bun") {
        dispatch(updateBun(item));
      } else if (item.type === "main" || item.type === "sauce") {
        const newItem: IIngredientWithOriginalId = {
          ...item,
          uniqueId: uuidv4(),
        };
        dispatch(addIngredients(newItem));
      }
    };
    const handleRemove = (ingredientId: string) => {
      dispatch(removeIngredients(ingredientId));
    };

    const moveIngredients = useCallback(
      (draggedUniqueId: string, hoverUniqueId: string) => {
        const draggedIndex = localIngredient.findIndex(
          (i) => i.uniqueId === draggedUniqueId
        );
        const hoverIndex = localIngredient.findIndex(
          (i) => i.uniqueId === hoverUniqueId
        );

        if (draggedIndex !== hoverIndex) {
          const updatedIngredients = [...localIngredient];
          const [draggedItem] = updatedIngredients.splice(draggedIndex, 1);
          updatedIngredients.splice(hoverIndex, 0, draggedItem);

          setLocalIngredient(updatedIngredients);

          dispatch(
            moveIngredient({ fromIndex: draggedIndex, toIndex: hoverIndex })
          );
        }
      },
      [localIngredient, dispatch]
    );

    const onDropEnd = () => {
      const transformedIngredients = transformIngredients(ingredients);
      setLocalIngredient(transformedIngredients);
    };

    const [{ canDrop, isOver }, dropRef] = useDrop<
      IIngredient,
      void,
      { isOver: boolean; canDrop: boolean }
    >(() => ({
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

    const elementType: "top" | "bottom" | undefined =
      type === "default" ? undefined : type;
    return (
      <div ref={dropRef} style={{ backgroundColor }} className={className}>
        {accept.includes("bun") ? (
          bun ? (
            <div className={constuctorStyle.element} key={bun._id}>
              <ConstructorElement
                type={elementType}
                isLocked={true}
                text={`${bun.name} ${text}`}
                price={bun.price}
                extraClass="ml-3 mr-3"
                thumbnail={`${bun.image_mobile}`}
              />
            </div>
          ) : (
            <div>Выберите булки</div>
          )
        ) : localIngredient.length > 0 ? (
          localIngredient.map((ingredient) => (
            <SortableIngredient
              key={ingredient.uniqueId}
              ingredientId={ingredient.uniqueId}
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

  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOrder = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }
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

    const orderIngredients = [
      { _id: bunId },
      ...ingredientIds.map((id) => ({ _id: id })),
      { _id: bunId },
    ];

    const orderData: ICreateOrderRequest = {
      ingredients: orderIngredients,
    };

    setIsLoadingOverride(true);
    openModal();

    createOrder(orderData)
      .unwrap()
      .then((data) => {
        const orderNumber = data.order.number;
        setOrderNumber(orderNumber);
      })
      .catch((error) => {
        console.error("Не удалось создать заказ:", error);
        if (error.status === 403) {
          setErrorMessage("Не удалось создать заказ. Обновите токен.");
        }
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoadingOverride(false);
        }, 15000);
      });
  };

  const handleClose = () => {
    closeModal();
    dispatch(clearCart());
    setErrorMessage(null);
  };

  const Preloader = () => {
    return (
      <div className={constuctorStyle.spinner}>
        <div className={constuctorStyle.loader}></div>
        <p>Загрузка...</p>
      </div>
    );
  };
  return (
    <section className="ml-10">
      <div className="pt-25">
        <div className="ml-4 mr-4">
          <div className={constuctorStyle.content}>
            <div data-testid="basket-bun-top">
              <Dustbin
                items={ingredients}
                accept={["bun"]}
                label="bun"
                type="top"
                text="(вверх)"
                className={constuctorStyle.bun_top}
              />
            </div>

            <div
              className={constuctorStyle.content_unlocked}
              data-testid="basket-ingredient"
            >
              <Dustbin
                items={ingredients}
                accept={["main", "sauce"]}
                label="main or sauce"
                className={constuctorStyle.ingredients}
              />
            </div>
            <div data-testid="basket-bun-bottom">
              <Dustbin
                items={ingredients}
                accept={["bun"]}
                label="bun"
                type="bottom"
                text="(низ)"
                className={constuctorStyle.bun_bottom}
              />
            </div>

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
                data-testid="create-order-button"
              >
                {isLoading ? "В процессе.." : "Оформить заказ"}
              </Button>
              {isModalOpen && (
                <Modal onClose={handleClose}>
                  {isLoading || isLoadingOverride ? (
                    <Preloader />
                  ) : errorMessage ? (
                    <div className={`${constuctorStyle.error} mb-10`}>
                      <p className="text text_type_main-default">
                        {errorMessage}
                      </p>
                    </div>
                  ) : (
                    <div data-testid="order-success-message">
                      <OrderDetails order={orderNumber} />
                    </div>
                  )}
                </Modal>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
