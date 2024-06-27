import {
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import HomePage from "../../pages/home/home";
import IngredientPage from "../ingredient-page/ingredient-page";
import AppHeader from "../app-header/app-header";
import appStyle from "./app.module.css";
import Modal from "../modal/modal";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state && location.state.background;

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <div className={appStyle.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/ingredients/:ingredientId"
          element={<IngredientPage/>}
        />
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/ingredients/:ingredientId"
            element={
              <Modal title="Детали ингредиента" onClose={handleModalClose}>
                <IngredientPage/>
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
}

export default App;
