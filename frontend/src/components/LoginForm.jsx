import { observer } from "mobx-react-lite";
import { Context } from "../main";
import { useContext } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

function LoginForm() {
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
    await store.login(email, password);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label htmlFor="login-email">Email</label>
      <input
        id="login-email"
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="you@example.com"
        value={email}
        autoComplete="email"
      />

      <label htmlFor="login-password">Пароль</label>
      <input
        id="login-password"
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Введите пароль"
        value={password}
        autoComplete="current-password"
      />

      {error && <p className="form-error">{error}</p>}
      <button className="form-submit" type="submit">
        Войти в аккаунт <span>→</span>
      </button>
      <p className="form-switch">
        Нет аккаунта? <Link to="/registration">Зарегистрироваться</Link>
      </p>
    </form>
  );
}

export default observer(LoginForm);
