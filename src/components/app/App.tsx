import React, { useEffect, useState } from "react";
import "./App.css";
import AppHeader from "../app-header/app-header";
import BurgerIngredients from "../burger-ingredients/burger-ingredients";
import BurgerConstructor from "../burger-constructor/burger-constructor";
// import data from "./utils/data";
const api = "https://norma.nomoreparties.space/api/ingredients";
function App() {
  const [dataIngredients, setDataIngredients] = useState([]);

  const getIngredients = async () => {
    try {
      const res = await fetch(api);
      if (!res.ok) {
        throw new Error("Ошибка" + res.status);
      }
      const data = await res.json();
      console.log(data.data)
      setDataIngredients(data.data);
    } catch (error) {
      console.error("Ошибка", error);
    }
  };
  useEffect(() => {
    getIngredients();
  }, [])

  return (
    <div className="App">
      <AppHeader />
      <main style={{ display: "flex", justifyContent: "center" }}>
        <BurgerIngredients ingredients={dataIngredients} />
        <BurgerConstructor ingredients={dataIngredients}/>
      </main>
    </div>
  );
}

export default App;
