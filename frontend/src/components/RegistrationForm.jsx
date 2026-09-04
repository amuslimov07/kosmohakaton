import { observer } from "mobx-react-lite";
import { Context } from "../main";
import { useContext } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

function RegistrationForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("volunteer");
  const { store } = useContext(Context);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Введите корректный email, например user@example.com");
      return;
    }
    if (password.length < 8) {
      setError("Пароль должен содержать минимум 8 символов");
      return;
    }
    const result = await store.registration(email, password, role);
    if (!result.success) setError(result.message);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label htmlFor="registration-email">Email</label>
      <input
        id="registration-email"
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="you@example.com"
        value={email}
        className={
          email && !/^\S+@\S+\.\S+$/.test(email) ? "input-invalid" : ""
        }
        autoComplete="email"
      />

      <label htmlFor="registration-password">Пароль</label>
      <input
        id="registration-password"
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Минимум 8 символов"
        value={password}
        className={password && password.length < 8 ? "input-invalid" : ""}
        autoComplete="new-password"
      />

      <div className="password-hint">
        Надёжность пароля:{" "}
        <strong className={password.length >= 8 ? "valid" : "invalid"}>
          {password.length >= 8 ? "подходит" : `${password.length}/8 символов`}
        </strong>
      </div>
      <fieldset className="role-choice">
        <legend>Тип аккаунта</legend>
        <label>
          <input
            type="radio"
            name="registration-role"
            value="volunteer"
            checked={role === "volunteer"}
            onChange={(e) => setRole(e.target.value)}
          />{" "}
          Обычный пользователь
        </label>
        <label>
          <input
            type="radio"
            name="registration-role"
            value="employee"
            checked={role === "employee"}
            onChange={(e) => setRole(e.target.value)}
          />{" "}
          Сотрудник ООПТ
        </label>
      </fieldset>

      {error && <p className="form-error">{error}</p>}
      <button className="form-submit" type="submit">
        Создать аккаунт <span>→</span>
      </button>
      <p className="form-switch">
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </form>
  );
}

export default observer(RegistrationForm);
