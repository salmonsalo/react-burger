import { Button } from "@ya.praktikum/react-developer-burger-ui-components";
import profileStyle from "./profile.module.css";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../components/auth-provider/auth-provider";

function ProfilePage() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
  };
  return (
    <div>
      <div className={`${profileStyle.box} mr-15`}>
        <nav className={`${profileStyle.questions} mt-20`}>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? `${profileStyle.link} text text_type_main-medium`
                : `${profileStyle.link_inactive} text text_type_main-medium text_color_inactive`
            }
            end
          >
            Профиль
          </NavLink>
          <NavLink
            to="/profile/orders"
            className={({ isActive }) =>
              isActive
                ? `${profileStyle.link} text text_type_main-medium`
                : `${profileStyle.link_inactive} text text_type_main-medium text_color_inactive`
            }
            end
          >
            История заказов
          </NavLink>
          <Button htmlType="button" type="secondary" onClick={handleLogout}>
            <p
              className={`${profileStyle.button} text text_type_main-medium text_color_inactive`}
            >
              Выход
            </p>
          </Button>
          <div className={profileStyle.info}>
            <p className="text text_type_main-default text_color_inactive mt-20 pr-10 pl-10">
              В этом разделе вы можете изменить свои персональные данные
            </p>
          </div>
        </nav>
        <Outlet />
      </div>
    </div>
  );
}

export default ProfilePage;
