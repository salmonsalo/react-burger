import {
  Button,
  Input,
} from "@ya.praktikum/react-developer-burger-ui-components";
import resetPasswordStyle from "./reset-password.module.css";
import { Link } from "react-router-dom";
function ResetPasswordPage() {
  return (
    <div className={resetPasswordStyle.content}>
      <div className={resetPasswordStyle.box}>
        <h2 className={resetPasswordStyle.h2}>Восстановление пароля</h2>
        <form className="mt-6 mb-6">
          <Input
            type={"text"}
            placeholder={"Введите новый пароль"}
            name={"name"}
            error={false}
            errorText={"Ошибка"}
            size={"default"}
            icon={"ShowIcon"}
            extraClass="mb-6"
          />
          <Input
            type={"text"}
            placeholder={"Введите код из письма"}
            name={"name"}
            error={false}
            errorText={"Ошибка"}
            size={"default"}
          />
        </form>
        <Button>Сохранить</Button>
        <div className={`${resetPasswordStyle.questions} mt-20`}>
          <p className="text text_type_main-default text_color_inactive mb-4">
            Вспомнили пароль?{" "}
            <Link className={resetPasswordStyle.link}>Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
