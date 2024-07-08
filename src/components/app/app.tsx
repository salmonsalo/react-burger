import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import HomePage from "../../pages/home/home";
import IngredientPage from "../ingredient-page/ingredient-page";
import AppHeader from "../app-header/app-header";
import appStyle from "./app.module.css";
import Modal from "../modal/modal";
import LoginPage from "../../pages/login/login";
import RegisterPage from "../../pages/register/register";
import ForgotPasswordPage from "../../pages/forgot-password/forgot-password";
import ResetPasswordPage from "../../pages/reset-password/reset-password";
import ProfilePage from "../../pages/profile/profile";
import ProtectedRouteElement from "../protected-route-element/protected-route-element";
import { AuthProvider } from "../auth-provider/auth-provider";
import ProfileForm from "../../pages/profile-form/profile-form";
import OrdersHistory from "../../pages/orders-history/orders-history";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state && location.state.background;

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <AuthProvider>
      <div className={appStyle.app}>
        <AppHeader />
        <Routes location={background || location}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/ingredients/:ingredientId"
            element={<IngredientPage />}
          />
          <Route
            path="/register"
            element={<ProtectedRouteElement restrictMode={true} />}
          >
            <Route index element={<RegisterPage />} />
          </Route>
          <Route
            path="/login"
            element={<ProtectedRouteElement restrictMode={true} />}
          >
            <Route index element={<LoginPage />} />
          </Route>
          <Route element={<ProtectedRouteElement restrictMode={false} />}>
            <Route path="/profile" element={<ProfilePage />}>
              <Route index element={<ProfileForm />} />
              <Route path="orders" element={<OrdersHistory />} />
            </Route>
          </Route>
          <Route
            path="/reset-password"
            element={<ProtectedRouteElement restrictMode={true} />}
          >
            <Route index element={<ResetPasswordPage />} />
          </Route>
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Routes>

        {background && (
          <Routes>
            <Route
              path="/ingredients/:ingredientId"
              element={
                <Modal title="Детали ингредиента" onClose={handleModalClose}>
                  <IngredientPage />
                </Modal>
              }
            />
          </Routes>
        )}
      </div>
    </AuthProvider>
  );
}

export default App;
