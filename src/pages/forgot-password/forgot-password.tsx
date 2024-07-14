import {
  Button,
  Input,
} from "@ya.praktikum/react-developer-burger-ui-components";
import forgotPasswordStyle from "./forgot-password.module.css";
import { Link, useNavigate } from "react-router-dom";
import React, { FormEvent, useEffect, useState } from "react";
import { useAuth } from "../../components/auth-provider/auth-provider";

const ForgotPasswordPage: React.FC = () =>{
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const { requestPasswordResetEmail, setVisitedForgotPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setVisitedForgotPassword(true);
  }, [setVisitedForgotPassword]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const result = await requestPasswordResetEmail(email);
      if (result) {
        setSuccess(true);
        navigate("/reset-password");
      } else {
        setError("Не удалось запросить сброс пароля.");
      }
    } catch (err) {
      setError("Произошла ошибка при запросе сброса пароля.");
    }
  };

  return (
    <div className={forgotPasswordStyle.content}>
      <div className={forgotPasswordStyle.box}>
        <h2 className={forgotPasswordStyle.h2}>Восстановление пароля</h2>
        <form
          className={`${forgotPasswordStyle.form} mt-6 mb-6`}
          onSubmit={handleSubmit}
        >
          <Input
            type={"text"}
            placeholder={"Укажите e-mail"}
            name={"email"}
            value={email}
            error={!!error}
            errorText={"Ошибка"}
            size={"default"}
            onChange={(e) => setEmail(e.target.value)}
            extraClass="mb-6"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          <Button htmlType="submit">Восстановить </Button>
        </form>

        <div className={`${forgotPasswordStyle.questions} mt-20`}>
          <p className="text text_type_main-default text_color_inactive mb-4">
            Вспомнили пароль?{" "}
            <Link to="/login" className={forgotPasswordStyle.link}>
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
