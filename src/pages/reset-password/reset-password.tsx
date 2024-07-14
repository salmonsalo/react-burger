import {
  Button,
  Input,
} from "@ya.praktikum/react-developer-burger-ui-components";
import resetPasswordStyle from "./reset-password.module.css";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import { useAuth } from "../../components/auth-provider/auth-provider";
function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { resetPasswordWithToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const result = await resetPasswordWithToken(token, password);
    if (result) {
      setSuccess(true);
      navigate("/login");
    } else {
      setError("Ошибка сброса пароля. Пожалуйста, попробуйте еще раз.");
    }
  };
  return (
    <div className={resetPasswordStyle.content}>
      <div className={resetPasswordStyle.box}>
        <h2 className={resetPasswordStyle.h2}>Восстановление пароля</h2>
        <form
          className={`${resetPasswordStyle.form} mt-6 mb-6`}
          onSubmit={handleSubmit}
        >
          <Input
            type={"password"}
            placeholder={"Введите новый пароль"}
            name={"newPassword"}
            value={password}
            error={!!error}
            errorText={error}
            size={"default"}
            icon={"ShowIcon"}
            extraClass="mb-6"
            onChange={(e) => setPassword(e.target.value)}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          <Input
            type={"text"}
            placeholder={"Введите код из письма"}
            name={"text"}
            value={token}
            error={!!error}
            errorText={error}
            size={"default"}
            onChange={(e) => setToken(e.target.value)}
            extraClass="mb-6"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          <Button htmlType="submit">Сохранить</Button>
        </form>

        <div className={`${resetPasswordStyle.questions} mt-20`}>
          <p className="text text_type_main-default text_color_inactive mb-4">
            Вспомнили пароль?{" "}
            <Link to="/login" className={resetPasswordStyle.link}>
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
