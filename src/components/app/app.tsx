// import appStyle from "./app.module.css";
// import AppHeader from "../app-header/app-header";
// import { useGetIngredientsQuery } from "../../services/burger-ingedients/api";
// import Home from "../../pages/home/home";

import { Route, Routes } from "react-router-dom";
import HomePage from "../../pages/home/home";

function App() {
  // const {
  //   isLoading: loading,
  //   error,
  //   data: ingredients,
  // } = useGetIngredientsQuery({});
  // if (loading) {
  //   return <h2>Загрузка...</h2>;
  // }

  // if (!loading && error) {
  //   return <h2>{`Ошибка: ${error}`}</h2>;
  // }

  // if (!loading && ingredients.length === 0) {
  //   return <h2>---</h2>;
  // }

  return (
    <Routes>
      <Route path="/home" element={<HomePage />}/>
    </Routes>
    // <div className={appStyle.app}>
    //   <AppHeader />
    //   <main className={appStyle.main}>
    //   <Home />
    //   </main>
    // </div>
  );
}

export default App;
