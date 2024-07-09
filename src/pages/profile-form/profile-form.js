import {
  Button,
  Input,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { useEffect, useState } from "react";
import { useFetchUserQuery, useUpdateUserMutation } from "../../utils/api";
import { useFormAndValidation } from "../../hooks/use-form-and-validation";

export default function ProfileForm() {
  const { data: userData, error, isLoading } = useFetchUserQuery();
  const [updateUser] = useUpdateUserMutation();
  const [isEditing, setIsEditing] = useState(false);
  const { values, handleChange, resetForm, setIsValid } =
    useFormAndValidation();

  useEffect(() => {
    if (userData && userData.success) {
      const { user } = userData;
      const initialValues = {
        name: user.name || "",
        email: user.email || "",
        password: "",
      };
      resetForm(initialValues, {}, true);
      setIsValid(true);
    }
  }, [userData, resetForm, setIsValid]);

  const handleInputChange = (event) => {
    handleChange(event);
    if (!isEditing) {
      setIsEditing(true);
    }
  };
  const handleSave = async () => {
    try {
      await updateUser(values).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error("Ошибка обновления данных пользователя:", err);
      setIsValid(false);
    }
  };

  const handleCancel = () => {
    if (userData && userData.success) {
      const { user } = userData;
      resetForm(
        {
          name: user.name || "",
          email: user.email || "",
          password: "",
        },
        {},
        true
      );
    }
    setIsEditing(false);
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки данных. Обновите токен.</div>;

  return (
    <>
      <form className="mt-6 mb-6">
        <Input
          type={"text"}
          placeholder={"Имя"}
          name={"name"}
          value={values.name || ""}
          onChange={handleInputChange}
          error={false}
          errorText={"Ошибка"}
          size={"default"}
          icon={"EditIcon"}
          extraClass="mb-6"
        />
        <Input
          type={"email"}
          placeholder={"Логин"}
          name={"email"}
          value={values.email || ""}
          onChange={handleInputChange}
          error={false}
          errorText={"Ошибка"}
          size={"default"}
          icon={"EditIcon"}
          extraClass="mb-6"
        />
        <Input
          type={"password"}
          placeholder={"Пароль"}
          name={"password"}
          value={values.password || ""}
          error={false}
          errorText={"Ошибка"}
          size={"default"}
          icon={"EditIcon"}
          extraClass="mb-6"
          onChange={handleInputChange}
        />
        {isEditing && (
          <div>
            <Button htmlType="button" onClick={handleSave}>
              Сохранить
            </Button>
            <Button htmlType="button" onClick={handleCancel}>
              Отмена
            </Button>
          </div>
        )}
      </form>
    </>
  );
}
