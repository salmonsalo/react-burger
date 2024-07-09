import {
  Button,
  Input,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import loginStyle from "./login.module.css";
import { useEffect } from "react";
import { useAuth } from "../../components/auth-provider/auth-provider";
import { useFormAndValidation } from "../../hooks/use-form-and-validation";

const initialState = {
  email: "",
  password: "",
};
function LoginPage() {
  const { values, handleChange, errors, isValid, setValues, resetForm } =
    useFormAndValidation(initialState);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, setVisitedForgotPassword } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();
    const { email, password } = values;

    if (!email || !password) {
      alert("Пожалуйста, заполните все поля");
      setValues((prevValues) => ({
        ...prevValues,
        email: !email ? "" : prevValues.email,
        password: !password ? "" : prevValues.password,
      }));
    } else {
      try {
        await login(email, password);
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
        resetForm();
      } catch (error) {
        console.error("Ошибка входа:", error);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setVisitedForgotPassword(false);
  }, [setVisitedForgotPassword]);

  return (
    <div className={loginStyle.content}>
      <div className={loginStyle.box}>
        <h2 className={loginStyle.h2}>Вход</h2>
        <form className={`${loginStyle.form} mt-6 mb-6`} onSubmit={handleLogin}>
          <Input
            type={"email"}
            placeholder={"E-mail"}
            value={values.email || ""}
            name={"email"}
            error={Boolean(errors.email)}
            errorText={"Введите корректный E-mail"}
            size={"default"}
            extraClass="mb-6"
            onChange={handleChange}
          />
          <Input
            type={"password"}
            placeholder={"Пароль"}
            value={values.password || ""}
            name={"password"}
            error={Boolean(errors.password)}
            errorText={"Введите корректный пароль"}
            size={"default"}
            icon={"ShowIcon"}
            extraClass="mb-6"
            onChange={handleChange}
          />
          <Button htmlType="submit" disabled={!isValid}>
            Войти
          </Button>
        </form>
        <div className={`${loginStyle.questions} mt-20`}>
          <p className="text text_type_main-default text_color_inactive mb-4">
            Вы — новый пользователь?{" "}
            <Link to="/register" className={loginStyle.link}>
              Зарегистрироваться
            </Link>
          </p>
          <p className="text text_type_main-default text_color_inactive">
            Забыли пароль?{" "}
            <Link to="/reset-password" className={loginStyle.link}>
              Восстановить пароль
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
