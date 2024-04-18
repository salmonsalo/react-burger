import ingredientsStyle from "./burger-ingredients.module.css";
import { useState } from "react";
import {
  CurrencyIcon,
  Tab,
  Counter,
} from "@ya.praktikum/react-developer-burger-ui-components";
import PropTypes from "prop-types";
import ModalOverlay from "../modal-overlay/modal-overlay";
import Modal from "../modal/modal";
import IngredientDetails from "../ingredient-details/ingredient-details";

export default function BurgerIngredients({ ingredients }) {
  const [current, setCurrent] = useState("one");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const renderIngredientsTypes = (types) => {
    let title = "";
    if (types === "bun") {
      title = "Булки";
    } else if (types === "main") {
      title = "Начинки";
    } else if (types === "sauce") {
      title = "Соусы";
    }

    return (
      <div>
        <h2 className="mb-6 text text_type_main-medium">{title}</h2>
        <div
          className="pt-6 pl-4 pr-4 pb-10"
          style={{
            display: "grid",
            gridTemplateColumns: "272px 272px",
            rowGap: "32px",
            columnGap: "24px",
          }}
        >
          {ingredients
            .filter((ingredient) => ingredient.type === types)
            .map((ingredient) => (
              <div
                key={ingredient.id}
                style={{ position: "relative", cursor: "pointer" }}
                onClick={() => {
                  openModal();
                  setSelectedIngredients(ingredient);
                }}
              >
                <Counter count={1} />
                <img src={ingredient.image} alt={ingredient.name} />
                <div
                  style={{ display: "flex", justifyContent: "center" }}
                  className="mt-1 mb-1"
                >
                  <p className="text text_type_digits-default mr-2">
                    {ingredient.price}
                  </p>
                  <CurrencyIcon type="primary" />
                </div>
                <div style={{ height: "48px" }}>
                  <p
                    className="text text_type_main-default"
                    style={{ textAlign: "center" }}
                  >
                    {ingredient.name}
                  </p>
                </div>
              </div>
            ))}
          {isModalOpen && (
            <ModalOverlay onClose={closeModal}>
              <Modal title="Детали ингредиента" onClose={closeModal}>
                <IngredientDetails
                  img={selectedIngredients?.image_large}
                  name={selectedIngredients?.name}
                  calories={selectedIngredients?.calories}
                  proteins={selectedIngredients?.proteins}
                  fat={selectedIngredients?.fat}
                  carbohydrates={selectedIngredients?.carbohydrates}
                />
              </Modal>
            </ModalOverlay>
          )}
        </div>
      </div>
    );
  };

  BurgerIngredients.propTypes = {
    ingredients: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        type: PropTypes.string,
        name: PropTypes.string,
        price: PropTypes.number,
        images: PropTypes.string,
        image_large: PropTypes.string,
        calories:PropTypes.string,
        proteins:PropTypes.string,
        fat:PropTypes.string,
        carbohydrates:PropTypes.string,
      })
    ).isRequired,
  };

  return (
    <section className={ingredientsStyle.container}>
      <div className="mb-10 mt-10">
        <h1 className="text text_type_main-large mb-5">Соберите бургер</h1>
        <div style={{ display: "flex" }}>
          <Tab value="one" active={current === "one"} onClick={setCurrent}>
            Булки
          </Tab>
          <Tab value="two" active={current === "two"} onClick={setCurrent}>
            Соусы
          </Tab>
          <Tab value="three" active={current === "three"} onClick={setCurrent}>
            Начинки
          </Tab>
        </div>
      </div>
      <div className={ingredientsStyle.content}>
        {renderIngredientsTypes("bun")}
        {renderIngredientsTypes("main")}
        {renderIngredientsTypes("sauce")}
      </div>
    </section>
  );
}
