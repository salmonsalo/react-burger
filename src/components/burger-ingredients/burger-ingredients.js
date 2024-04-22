import ingredientsStyle from "./burger-ingredients.module.css";
import { useState } from "react";
import {
  CurrencyIcon,
  Tab,
  Counter,
} from "@ya.praktikum/react-developer-burger-ui-components";
import Modal from "../modal/modal";
import IngredientDetails from "../ingredient-details/ingredient-details";
import { ingredientType } from "../../utils/types";

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
          className={`${ingredientsStyle.ingredients} pt-6 pl-4 pr-4 pb-10`}
        >
          {ingredients
            .filter((ingredient) => ingredient.type === types)
            .map((ingredient) => (
              <div
                key={ingredient._id}
                className={ingredientsStyle.ingredient}
                onClick={() => {
                  openModal();
                  setSelectedIngredients(ingredient);
                }}
              >
                <Counter count={1} />
                <img src={ingredient.image} alt={ingredient.name} />
                <div
                  className={`${ingredientsStyle.price} mt-1 mb-1`}
                >
                  <p className="text text_type_digits-default mr-2">
                    {ingredient.price}
                  </p>
                  <CurrencyIcon type="primary" />
                </div>
                <div className={ingredientsStyle.name_container}>
                  <p
                    className={`${ingredientsStyle.name} text text_type_main-default`}
                  >
                    {ingredient.name}
                  </p>
                </div>
              </div>
            ))}
          {isModalOpen && (
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
          )}
        </div>
      </div>
    );
  };

  BurgerIngredients.propTypes = {
    ingredients: ingredientType.isRequired,
  };

  return (
    <section className={ingredientsStyle.container}>
      <div className="mb-10 mt-10">
        <h1 className="text text_type_main-large mb-5">Соберите бургер</h1>
        <div className={ingredientsStyle.tabs}>
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
