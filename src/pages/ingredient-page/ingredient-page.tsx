import { useParams } from "react-router-dom";
import IngredientDetails from "../../components/ingredient-details/ingredient-details";
import { useGetIngredientsQuery } from "../../services/burger-ingedients/api";
import { useMemo } from "react";
import ingredientPage from "./ingredient-page.module.css";

export default function IngredientPage() {
  const { ingredientId } = useParams();
  const { data: ingredientsData } = useGetIngredientsQuery();
  const ingredient = useMemo(
    () => ingredientsData?.data.find((item) => item._id === ingredientId),
    [ingredientsData, ingredientId]
  );
  return ingredient ? (
    <div className={ingredientPage.content}>
      <IngredientDetails
        image_large={ingredient.image_large}
        name={ingredient.name}
        calories={ingredient.calories}
        proteins={ingredient.proteins}
        fat={ingredient.fat}
        carbohydrates={ingredient.carbohydrates}
      />
    </div>
  ) : (
    <div>Данные об ингредиентах отсутствуют.</div>
  );
}
