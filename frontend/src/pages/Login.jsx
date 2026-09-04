import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../main";
import { observer } from "mobx-react-lite";

function Login() {
  const { store } = useContext(Context);
  if (store.isLoading) {
    return <div>Загрузка....</div>;
  }
  if (!store.isAuth) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <div className="eyebrow">Долина чистоты</div>
          <h1>С возвращением</h1>
          <p className="auth-lead">Войдите, чтобы продолжить очищать долину.</p>
          <LoginForm />
        </section>
        <Link className="back-link" to="/registration">
          ← Вернуться к регистрации
        </Link>
      </main>
    );
  }
  return (
    <div>
      <h1>Вы уже вошли</h1>
      <p>{store.user.email}</p>
      <button className="form-submit" onClick={() => store.logout()}>
        Выйти
      </button>
    </div>
  );
}
export default observer(Login);
