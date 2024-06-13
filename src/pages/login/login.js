import {
  Button,
  Input,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { Link } from "react-router-dom";
import loginStyle from "./login.module.css";

function LoginPage() {
  return (
    <div className={loginStyle.content}>
      <div className={loginStyle.box}>
        <h2 className={loginStyle.h2}>Вход</h2>
        <form className="mt-6 mb-6">
          <Input
            type={"text"}
            placeholder={"E-mail"}
            name={"name"}
            error={false}
            errorText={"Ошибка"}
            size={"default"}
            extraClass="mb-6"
          />
          <Input
            type={"text"}
            placeholder={"Пароль"}
            name={"name"}
            error={false}
            errorText={"Ошибка"}
            size={"default"}
            icon={"ShowIcon"}
          />
        </form>
        <Button>Войти</Button>
        <div className={`${loginStyle.questions} mt-20`}>
          <p className="text text_type_main-default text_color_inactive mb-4">
            Вы — новый пользователь?{" "}
            <Link className={loginStyle.link}>Зарегистрироваться</Link>
          </p>
          <p className="text text_type_main-default text_color_inactive">
            Забыли пароль?{" "}
            <Link className={loginStyle.link}>Восстановить пароль</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
