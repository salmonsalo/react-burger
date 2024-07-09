import AppHeader from "../../components/app-header/app-header";
import BurgerConstructor from "../../components/burger-constructor/burger-constructor";
import BurgerIngredients from "../../components/burger-ingredients/burger-ingredients";
import { useGetIngredientsQuery } from "../../services/burger-ingedients/api";
import homeStyle from "./home.module.css";

function HomePage() {
  const {
    isLoading: loading,
    error,
    data: ingredients,
  } = useGetIngredientsQuery({});
  if (loading) {
    return <h2>Загрузка...</h2>;
  }

  if (!loading && error) {
    return <h2>{`Ошибка: ${error}`}</h2>;
  }

  if (!loading && ingredients.length === 0) {
    return <h2>---</h2>;
  }
  return (
      <main className={homeStyle.main}>
        <BurgerIngredients />
        <BurgerConstructor />
      </main>
  );
}

export default HomePage;
