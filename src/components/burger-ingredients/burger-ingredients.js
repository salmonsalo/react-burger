import ingredientsStyle from "./burger-ingredients.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CurrencyIcon,
  Tab,
  Counter,
} from "@ya.praktikum/react-developer-burger-ui-components";
import Modal from "../modal/modal";
import IngredientDetails from "../ingredient-details/ingredient-details";
import { useGetIngredientsQuery } from "../../services/burger-ingedients/api";
import { useDrag } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import {
  closeModalIngredient,
  openModalIngredient,
} from "../../services/burger-ingedients/ingredientModalSlice";
import { boxType } from "../../utils/types";

export default function BurgerIngredients() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data } = useGetIngredientsQuery();
  const ingredients = data?.data ?? [];
  const dispatch = useDispatch();
  const ingredientModal = useSelector(
    (state) => state.ingredientModalSlice.ingredientModal
  );

  const handleOpenIngredientModal = useCallback(
    (ingredientId) => {
      const ingredient = ingredients.find((i) => i._id === ingredientId);
      dispatch(openModalIngredient(ingredient));
      setIsModalOpen(true);
    },
    [ingredients, dispatch]
  );

  const handleCloseIngredientModal = useCallback(() => {
    dispatch(closeModalIngredient());
    setIsModalOpen(false);
  }, [dispatch]);

  const [current, setCurrent] = useState("bun");
  const containerRef = useRef(null);
  const sectionsRefs = {
    bun: useRef(null),
    main: useRef(null),
    sauce: useRef(null),
  };

  const handleClick = (section) => {
    const sectionRef = sectionsRefs[section].current;

    if (sectionRef) {
      sectionRef.scrollIntoView({ behavior: "smooth" });
    }

    setCurrent(section);
  };

  const handleScroll = () => {
    if (!containerRef.current) return;

    const containerTop = containerRef.current.getBoundingClientRect().top;
    const distances = {};

    Object.keys(sectionsRefs).forEach((key) => {
      const section = sectionsRefs[key].current;
      if (section) {
        const rect = section.getBoundingClientRect();
        distances[key] = Math.abs(rect.top - containerTop);
      }
    });

    const closest = Object.keys(distances).reduce((a, b) =>
      distances[a] < distances[b] ? a : b
    );
    setCurrent(closest);
  };

  useEffect(() => {
    const containerElement = containerRef.current;

    if (containerElement) {
      containerElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (containerElement) {
        containerElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const Box = function Box({ item, onClick }) {
    const ingredient = useSelector(
      (state) => state.constructorSlice.ingredients
    );
    const bun = useSelector((state) => state.constructorSlice.bun);

    let quantity = 0;
    if (item.type === "bun") {
      quantity = bun && bun._id === item._id ? 2 : 0;
    } else {
      quantity = ingredient.reduce((count, ingredient) => {
        if (ingredient._id === item._id) {
          count += 1;
        }
        return count;
      }, 0);
    }

    const [{ isDragging }, dragRef] = useDrag(() => ({
      type: "ingredient",
      item,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        handlerId: monitor.getHandlerId(),
      }),
    }));

    const opacity = isDragging ? 0.4 : 1;

    return (
      <div ref={dragRef} style={{ opacity }} data-testid={`box`}>
        <div
          key={item._id}
          className={ingredientsStyle.ingredient}
          onClick={() => onClick(item._id)}
        >
          {quantity <= 0 ? null : <Counter count={quantity} />}

          <img src={item.image} alt={item.name} />
          <div className={`${ingredientsStyle.price} mt-1 mb-1`}>
            <p className="text text_type_digits-default mr-2">{item.price}</p>
            <CurrencyIcon type="primary" />
          </div>
          <div className={ingredientsStyle.name_container}>
            <p
              className={`${ingredientsStyle.name} text text_type_main-default`}
            >
              {item.name}
            </p>
          </div>
        </div>
      </div>
    );
  };

  Box.propTypes = boxType.isRequired;

  const renderIngredientsTypes = useCallback(
    (types) => {
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
                <Box
                  key={ingredient._id}
                  item={ingredient}
                  onClick={handleOpenIngredientModal}
                />
              ))}
          </div>
        </div>
      );
    },
    [ingredients, handleOpenIngredientModal]
  );

  return (
    <section className={ingredientsStyle.container}>
      <div className="mb-10 mt-10">
        <h1 className="text text_type_main-large mb-5">Соберите бургер</h1>
        <div className={ingredientsStyle.tabs}>
          <Tab
            value="bun"
            active={current === "bun"}
            onClick={() => handleClick("bun")}
          >
            Булки
          </Tab>
          <Tab
            value="main"
            active={current === "main"}
            onClick={() => handleClick("main")}
          >
            Начинки
          </Tab>
          <Tab
            value="sauce"
            active={current === "sauce"}
            onClick={() => handleClick("sauce")}
          >
            Соусы
          </Tab>
        </div>
      </div>
      <div ref={containerRef} className={ingredientsStyle.content}>
        <div ref={sectionsRefs.bun}>{renderIngredientsTypes("bun")}</div>
        <div ref={sectionsRefs.main}>{renderIngredientsTypes("main")}</div>
        <div ref={sectionsRefs.sauce}>{renderIngredientsTypes("sauce")}</div>

        {isModalOpen && ingredientModal && (
          <Modal
            title="Детали ингредиента"
            onClose={handleCloseIngredientModal}
          >
            <IngredientDetails
              img={ingredientModal?.image_large}
              name={ingredientModal?.name}
              calories={ingredientModal?.calories}
              proteins={ingredientModal?.proteins}
              fat={ingredientModal?.fat}
              carbohydrates={ingredientModal?.carbohydrates}
            />
          </Modal>
        )}
      </div>
    </section>
  );
}
