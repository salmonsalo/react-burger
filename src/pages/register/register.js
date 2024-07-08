import {
  Button,
  Input,
} from "@ya.praktikum/react-developer-burger-ui-components";
import registerStyle from "./register.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../../utils/api";
import { useEffect, useState } from "react";

const initialState = { name: "", email: "", password: "" };

function RegisterPage() {
  const [formValue, setFormValue] = useState(initialState);
  const { name, email, password } = formValue;
  const [formErrors, setFormErrors] = useState({
    email: false,
    password: false,
    name: false,
  });
  const [
    registerUser,
    {
      isSuccess: isRegisterSuccess,
      isError: isRegisterError,
      error: registerError,
    },
  ] = useRegisterUserMutation();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    if (!email || !password || !name) {
      setFormErrors({
        email: !email,
        password: !password,
      });
      alert("Пожалуйста, заполните все поля");
    } else {
      setFormErrors({
        name: false,
        email: false,
        password: false,
      });
      await registerUser({ name, email, password });
    }
  };

  useEffect(() => {
    if (isRegisterSuccess) {
      setFormValue(initialState);
      navigate("/login");
    } else if (isRegisterError) {
      alert(
        `Ошибка регистрации: ${registerError?.message || "Неизвестная ошибка"}`
      );
    }
  }, [isRegisterSuccess, isRegisterError, navigate, registerError]);
  return (
    <div className={registerStyle.content}>
      <div className={registerStyle.box}>
        <h2 className={registerStyle.h2}>Регистрация</h2>
        <form
          className={`${registerStyle.form} mt-6 mb-6`}
          onSubmit={handleRegister}
        >
          <Input
            type={"text"}
            placeholder={"Имя"}
            name={"name"}
            value={name}
            error={false}
            errorText={"Ошибка"}
            size={"default"}
            extraClass="mb-6"
            onChange={handleInputChange}
          />
          <Input
            type={"email"}
            placeholder={"E-mail"}
            value={email}
            name={"email"}
            error={false}
            errorText={"Ошибка"}
            size={"default"}
            extraClass="mb-6"
            onChange={handleInputChange}
          />
          <Input
            type={"password"}
            placeholder={"Пароль"}
            value={password}
            name={"password"}
            error={false}
            errorText={"Ошибка"}
            size={"default"}
            icon={"ShowIcon"}
            extraClass="mb-6"
            onChange={handleInputChange}
          />
          <Button htmlType="submit">Зарегестрироваться</Button>
        </form>
        <div className={`${registerStyle.questions} mt-20`}>
          <p className="text text_type_main-default text_color_inactive mb-4">
            Уже зарегестрированы?{" "}
            <Link to="/login" className={registerStyle.link}>
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
