import React, { useEffect, useState } from "react";
import appStyle from "./app.module.css";
import AppHeader from "../app-header/app-header";
import BurgerIngredients from "../burger-ingredients/burger-ingredients";
import BurgerConstructor from "../burger-constructor/burger-constructor";
import { useGetIngredientsQuery } from "../../services/burger-ingedients/api";

function App() {
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
    <div className={appStyle.app}>
      <AppHeader />
      <main className={appStyle.main}>
        <BurgerIngredients />
        <BurgerConstructor />
      </main>
    </div>
  );
}

export default App;
