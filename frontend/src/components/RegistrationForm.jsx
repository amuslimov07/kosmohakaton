import { observer } from "mobx-react-lite";
import { Context } from "../main";
import { useContext } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

function RegistrationForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("volunteer");
  const [employeeSecret, setEmployeeSecret] = useState("");
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
    if (role === "employee" && !employeeSecret) {
      setError("Введите секретный код сотрудника ООПТ");
      return;
    }
    const result = await store.registration(
      email,
      password,
      role,
      employeeSecret,
    );
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
        <legend>Выберите роль</legend>
        <div className="role-cards">
          <button
            className={`role-card ${role === "volunteer" ? "selected" : ""}`}
            type="button"
            onClick={() => setRole("volunteer")}
            aria-pressed={role === "volunteer"}
          >
            <strong>Волонтёр</strong>
            <span>
              Участвуйте в мероприятиях, проходите обучение и помогайте охранять
              природные территории.
            </span>
          </button>
          <button
            className={`role-card ${role === "employee" ? "selected" : ""}`}
            type="button"
            onClick={() => setRole("employee")}
            aria-pressed={role === "employee"}
          >
            <strong>Сотрудник ООПТ</strong>
            <span>
              Управляйте мероприятиями и задачами природоохранной территории.
            </span>
          </button>
        </div>
      </fieldset>

      {role === "employee" && (
        <div className="employee-secret-field">
          <label htmlFor="employee-secret">Секретный код сотрудника ООПТ</label>
          <input
            id="employee-secret"
            onChange={(e) => setEmployeeSecret(e.target.value)}
            type="password"
            placeholder="Введите код"
            value={employeeSecret}
            autoComplete="off"
          />
          <small>
            Код необходим для подтверждения права регистрации аккаунта
            сотрудника ООПТ.
          </small>
        </div>
      )}

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
