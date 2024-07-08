import {
  Button,
  Input,
} from "@ya.praktikum/react-developer-burger-ui-components";
import registerStyle from "./register.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../../utils/api";
import { useEffect } from "react";
import { useFormAndValidation } from "../../hooks/use-form-and-validation";

const initialState = { name: "", email: "", password: "" };

function RegisterPage() {
  const { values, handleChange, errors, resetForm } =
    useFormAndValidation(initialState);
  const [
    registerUser,
    {
      isSuccess: isRegisterSuccess,
      isError: isRegisterError,
      error: registerError,
    },
  ] = useRegisterUserMutation();
  const navigate = useNavigate();

  useEffect(() => {
    resetForm(initialState, {}, false);
  }, [resetForm]);

  const handleRegister = async (event) => {
    event.preventDefault();
    const { name, email, password } = values;

    if (!name || !email || !password) {
      alert("Пожалуйста, заполните все поля");
    } else {
      await registerUser({ name, email, password });
    }
  };

  useEffect(() => {
    if (isRegisterSuccess) {
      resetForm(initialState);
      navigate("/login");
    } else if (isRegisterError) {
      alert(
        `Ошибка регистрации: ${registerError?.message || "Неизвестная ошибка"}`
      );
    }
  }, [isRegisterSuccess, isRegisterError, navigate, resetForm, registerError]);

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
            value={values.name || ""}
            error={!!errors.name}
            errorText={"Ошибка"}
            size={"default"}
            extraClass="mb-6"
            onChange={handleChange}
          />
          <Input
            type={"email"}
            placeholder={"E-mail"}
            value={values.email || ""}
            name={"email"}
            error={!!errors.email}
            errorText={"Ошибка"}
            size={"default"}
            extraClass="mb-6"
            onChange={handleChange}
          />
          <Input
            type={"password"}
            placeholder={"Пароль"}
            value={values.password || ""}
            name={"password"}
            error={!!errors.password}
            errorText={"Ошибка"}
            size={"default"}
            icon={"ShowIcon"}
            extraClass="mb-6"
            onChange={handleChange}
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
