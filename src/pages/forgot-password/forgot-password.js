import {
  Button,
  Input,
} from "@ya.praktikum/react-developer-burger-ui-components";
import forgotPasswordStyle from "./forgot-password.module.css";
import { Link } from "react-router-dom";
function ForgotPasswordPage() {
    return (
      <div className={forgotPasswordStyle.content}>
      <div className={forgotPasswordStyle.box}>
        <h2 className={forgotPasswordStyle.h2}>Восстановление пароля</h2>
        <form className="mt-6 mb-6">
          <Input
            type={"text"}
            placeholder={"Укажите e-mail"}
            name={"name"}
            error={false}
            errorText={"Ошибка"}
            size={"default"}
          />
        </form>
        <Button>Восстановить </Button>
        <div className={`${forgotPasswordStyle.questions} mt-20`}>
          <p className="text text_type_main-default text_color_inactive mb-4">
            Вспомнили пароль?{" "}
            <Link className={forgotPasswordStyle.link}>Войти</Link>
          </p>
        </div>
      </div>
    </div>
    );
  }
  
  export default ForgotPasswordPage;