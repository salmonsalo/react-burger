import {
  Button,
  Input,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import loginStyle from "./login.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../components/auth-provider/auth-provider";

const initialState = {
  email: "",
  password: "",
};
function LoginPage() {
  const [formValue, setFormValue] = useState(initialState);
  const { email, password } = formValue;
  const [formErrors, setFormErrors] = useState({
    email: false,
    password: false,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, setVisitedForgotPassword } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setFormErrors({ email: !email, password: !password });
      alert("Пожалуйста, заполните все поля");
    } else {
      setFormErrors({ email: false, password: false });
      try {
        await login(email, password);
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
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
            value={email}
            name={"email"}
            error={formErrors.email}
            errorText={"Введите корректный E-mail"}
            size={"default"}
            extraClass="mb-6"
            onChange={handleInputChange}
          />
          <Input
            type={"password"}
            placeholder={"Пароль"}
            value={password}
            name={"password"}
            error={formErrors.password}
            errorText={"Введите корректный пароль"}
            size={"default"}
            icon={"ShowIcon"}
            extraClass="mb-6"
            onChange={handleInputChange}
          />
          <Button htmlType="submit">Войти</Button>
        </form>
        <div className={`${loginStyle.questions} mt-20`}>
          <p className="text text_type_main-default text_color_inactive mb-4">
            Вы — новый пользователь?
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
