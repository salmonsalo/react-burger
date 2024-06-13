import {
  Button,
  Input,
} from "@ya.praktikum/react-developer-burger-ui-components";
import registerStyle from "./register.module.css";
import { Link } from "react-router-dom";

function RegisterPage() {
  return (
    <div className={registerStyle.content}>
      <div className={registerStyle.box}>
        <h2 className={registerStyle.h2}>Регистрация</h2>
        <form className="mt-6 mb-6">
          <Input
            type={"text"}
            placeholder={"Имя"}
            name={"name"}
            error={false}
            errorText={"Ошибка"}
            size={"default"}
            extraClass="mb-6"
          />
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
        <Button>Зарегестрироваться</Button>
        <div className={`${registerStyle.questions} mt-20`}>
          <p className="text text_type_main-default text_color_inactive mb-4">
            Уже зарегестрированы? <Link  className={registerStyle.link}>Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
