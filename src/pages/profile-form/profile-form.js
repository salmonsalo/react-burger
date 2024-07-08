import {
  Button,
  Input,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { useEffect, useState } from "react";
import { useFetchUserQuery, useUpdateUserMutation } from "../../utils/api";

export default function ProfileForm() {
  const { data: userData, error, isLoading } = useFetchUserQuery();
  const [updateUser] = useUpdateUserMutation();
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [originalValues, setOriginalValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userData && userData.success) {
      const { user } = userData;
      setFormValues({ name: user.name || '', email: user.email || '', password: '' });
      setOriginalValues({ name: user.name || '', email: user.email || '', password: '' });
    }
  }, [userData]);


  const handleSave = async () => {
    try {
      await updateUser(formValues).unwrap();
      setOriginalValues(formValues);
      setIsEditing(false);
    } catch (err) {
      console.error("Ошибка обновления данных пользователя:", err);
    }
  };

  const handleCancel = () => {
    setFormValues(originalValues);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({ ...prevState, [name]: value }));
    setIsEditing(true);
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
          value={formValues.name}
          onChange={handleChange}
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
          value={formValues.email}
          onChange={handleChange}
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
          value={formValues.password}
          error={false}
          errorText={"Ошибка"}
          size={"default"}
          icon={"EditIcon"}
          extraClass="mb-6"
          onChange={handleChange}
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
