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
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Введите корректный email, например user@example.com");
      return;
    }
    if (!password || password.length < 8) {
      setError("Пароль должен содержать минимум 8 символов");
      return;
    }
    const result = await store.login(email, password);
    if (!result.success) setError(result.message);
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
        className={
          email && !/^\S+@\S+\.\S+$/.test(email) ? "input-invalid" : ""
        }
        autoComplete="email"
      />

      <label htmlFor="login-password">Пароль</label>
      <input
        id="login-password"
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Введите пароль"
        value={password}
        className={password && password.length < 8 ? "input-invalid" : ""}
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
