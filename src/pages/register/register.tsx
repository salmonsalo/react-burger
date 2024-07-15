import {
  Button,
  Input,
} from "@ya.praktikum/react-developer-burger-ui-components";
import registerStyle from "./register.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../../utils/api";
import React, { useEffect } from "react";
import { useFormAndValidation } from "../../hooks/use-form-and-validation";

interface IFormValues {
  name: string;
  email: string;
  password: string;
}

const initialState: IFormValues = { name: "", email: "", password: "" };

const RegisterPage: React.FC = () => {
  const { values, handleChange, errors, resetForm } =
    useFormAndValidation<IFormValues>(initialState);
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
    resetForm(initialState);
  }, [resetForm]);

  const handleRegister: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
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
      let errorMessage = "Неизвестная ошибка";

      if (
        registerError &&
        "data" in registerError &&
        typeof registerError.data === "object" &&
        registerError.data !== null
      ) {
        const errorData = registerError.data as { message?: string };
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (registerError && "message" in registerError) {
        errorMessage = (registerError as { message: string }).message;
      }

      alert(`Ошибка регистрации: ${errorMessage}`);
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
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
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
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
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
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
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
};

export default RegisterPage;
