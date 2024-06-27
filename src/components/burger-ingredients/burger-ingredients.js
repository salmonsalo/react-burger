import ingredientsStyle from "./burger-ingredients.module.css";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import {
  CurrencyIcon,
  Tab,
  Counter,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { useGetIngredientsQuery } from "../../services/burger-ingedients/api";
import { useDrag } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import { openModalIngredient } from "../../services/burger-ingedients/ingredientModalSlice";
import { boxType } from "../../utils/types";
import { Link, useLocation } from "react-router-dom";

export default function BurgerIngredients() {
  const { data: ingredientsData } = useGetIngredientsQuery();
  const ingredients = useMemo(
    () => ingredientsData?.data ?? [],
    [ingredientsData]
  );
  const dispatch = useDispatch();

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

  const Box = function Box({ item }) {
    const location = useLocation();
    const ingredientId = item["_id"];
    const handleClick = () => {
      dispatch(openModalIngredient(item));
    };

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
      <Link
        key={ingredientId}
        to={`/ingredients/${ingredientId}`}
        state={{ background: location }}
        onClick={handleClick}
        className={`${ingredientsStyle.link}`}
      >
        <div ref={dragRef} style={{ opacity }} data-testid={`box`}>
          <div className={ingredientsStyle.ingredient}>
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
      </Link>
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

      const filteredIngredients = ingredients.filter(
        (ingredient) => ingredient.type === types
      );
      return (
        <div>
          <h2 className="mb-6 text text_type_main-medium">{title}</h2>
          <div
            className={`${ingredientsStyle.ingredients} pt-6 pl-4 pr-4 pb-10`}
          >
            {filteredIngredients.map((ingredient) => (
              <Box
                key={ingredient._id}
                item={ingredient}
                onClick={() => handleClick(ingredient._id)}
              />
            ))}
          </div>
        </div>
      );
    },
    [ingredients]
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
      </div>
    </section>
  );
}
