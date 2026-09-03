import { observer } from "mobx-react-lite";
import { Context } from "../main";
import { useContext } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

function RegistrationForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { store } = useContext(Context);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Заполните email и пароль");
      return;
    }
    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }
    await store.registration(email, password);
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
        autoComplete="email"
      />

      <label htmlFor="registration-password">Пароль</label>
      <input
        id="registration-password"
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Минимум 6 символов"
        value={password}
        autoComplete="new-password"
      />

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
