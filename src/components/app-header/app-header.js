import { NavLink } from "react-router-dom";
import headerStyle from "./app-header.module.css";
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";

export default function AppHeader() {
  return (
      <header className={headerStyle.header}>
        <nav className={headerStyle.nav}>
          <div className={headerStyle.nav_conteynir}>
            <a href="/" className={headerStyle.link}>
            <div className="mr-2">
                <BurgerIcon type="secondary"/>
              </div>
              <p className="text text_type_main-default text_color_inactive">
                Конструктор
              </p>
            </a>
            <a href="/" className={headerStyle.link}>
              <div className="mr-2">
                <ListIcon type="secondary"/>
              </div>
              <p className="text text_type_main-default text_color_inactive">
                Лента заказов
              </p>
            </a>
          </div>
          <Logo />
          <NavLink to="/profile" className={headerStyle.link} >
            <div className="mr-2">
              <ProfileIcon type="secondary"/>
            </div>
            <p className="text text_type_main-default text_color_inactive">
              Личный кабинет
            </p>
          </NavLink>
        </nav>
      </header>
  );
}
