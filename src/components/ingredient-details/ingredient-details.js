import { ingredientDetailsType } from "../../utils/types";
import ingredientsDetailsStyle from "./ingredient-details.module.css";

export default function IngredientDetails({
  image_large,
  name,
  calories,
  proteins,
  fat,
  carbohydrates,
}) {
  return (
    <div className={ingredientsDetailsStyle.content}>
      <img src={image_large} alt={name} />
      <p
        className={`${ingredientsDetailsStyle.name} text text_type_main-medium mt-4`}
      >
        {name}
      </p>
      <div className={`${ingredientsDetailsStyle.description} mt-8`}>
        <div className={ingredientsDetailsStyle.item}>
          <p className="text text_type_main-default text_color_inactive">
            Калории,ккал
          </p>
          <p className="text text_type_digits-default text_color_inactive">
            {calories}
          </p>
        </div>
        <div className={ingredientsDetailsStyle.item}>
          <p className="text text_type_main-default text_color_inactive">
            Белки, г
          </p>
          <p className="text text_type_digits-default text_color_inactive">
            {proteins}
          </p>
        </div>
        <div className={ingredientsDetailsStyle.item}>
          <p className="text text_type_main-default text_color_inactive">
            Жиры, г
          </p>
          <p className="text text_type_digits-default text_color_inactive">
            {fat}
          </p>
        </div>
        <div className={ingredientsDetailsStyle.item}>
          <p className="text text_type_main-default text_color_inactive">
            Углеводы, г
          </p>
          <p className="text text_type_digits-default text_color_inactive">
            {carbohydrates}
          </p>
        </div>
      </div>
    </div>
  );
}

// IngredientDetails.propTypes = ingredientDetailsType;
