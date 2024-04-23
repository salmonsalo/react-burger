import constuctorStyle from "./burger-constructor.module.css";
import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { useState } from "react";
import Modal from "../modal/modal";
import OrderDetails from "../order-details/order-details";
import PropTypes from "prop-types";

export default function BurgerConstructor({ ingredients }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const ingredientBun = ingredients.filter(
    (ingredient) => ingredient.type === "bun"
  );
  const bunElement = ingredientBun.length > 0 ? ingredientBun[0] : null;

  BurgerConstructor.propTypes = {
    ingredients: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        type: PropTypes.string,
        name: PropTypes.string,
        price: PropTypes.number,
        image_mobile: PropTypes.string,
      })
    ).isRequired,
  };

  return (
    <section className="ml-10">
      <div className="pt-25">
        <div className="ml-4 mr-4">
          <div className={constuctorStyle.content}>
            {bunElement && (
              <div key={bunElement._id}>
                <ConstructorElement
                  type="top"
                  isLocked={true}
                  text={`${bunElement.name}(верх)`}
                  price={`${bunElement.price}`}
                  extraClass="ml-8 mr-8"
                  thumbnail={`${bunElement.image_mobile}`}
                />
              </div>
            )}

            <div className={constuctorStyle.content_unlocked}>
              {ingredients
                .filter((ingredient) => ingredient.type !== "bun")
                .map((ingredient) => (
                  <div className={constuctorStyle.element} key={ingredient._id}>
                    <DragIcon type="primary" />
                    <ConstructorElement
                      text={`${ingredient.name}`}
                      price={`${ingredient.price}`}
                      extraClass="ml-3 mr-3"
                      thumbnail={`${ingredient.image_mobile}`}
                    />
                  </div>
                ))}
            </div>
            {bunElement && (
              <div key={bunElement.id}>
                <ConstructorElement
                  type="bottom"
                  isLocked={true}
                  text={`${bunElement.name}(низ)`}
                  price={`${bunElement.price}`}
                  extraClass="ml-8 mr-8"
                  thumbnail={`${bunElement.image_mobile}`}
                />
              </div>
            )}
            <div
              className={`${constuctorStyle.payment} mt-6`}

            >
              <div className={constuctorStyle.price}>
                <p className="text text_type_digits-medium mr-2">600</p>
                <CurrencyIcon type="primary" />
              </div>
              <Button
                htmlType="button"
                type="primary"
                size="large"
                extraClass="ml-10 mr-8"
                onClick={openModal}
              >
                Оформить заказ
              </Button>
              {isModalOpen && (
                <Modal onClose={closeModal}>
                  <OrderDetails />
                </Modal>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
