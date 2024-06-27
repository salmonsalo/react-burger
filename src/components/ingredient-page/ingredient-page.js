import { useParams } from "react-router-dom";
import IngredientDetails from "../ingredient-details/ingredient-details";
import { useGetIngredientsQuery } from "../../services/burger-ingedients/api";
import { useMemo } from "react";

export default function IngredientPage() {
  const { ingredientId } = useParams();
  const { data: ingredientsData } = useGetIngredientsQuery();
  const ingredients = useMemo(() => ingredientsData?.data ?? [], [ingredientsData]);
  const ingredient = ingredients.find((item) => item._id === ingredientId);

  return ingredient ? (
    <IngredientDetails
      image_large={ingredient.image_large}
      name={ingredient.name}
      calories={ingredient.calories}
      proteins={ingredient.proteins}
      fat={ingredient.fat}
      carbohydrates={ingredient.carbohydrates}
    />
  ) : (
    <div>No ingredient data</div>
  );
}
